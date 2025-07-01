<?php

use App\Models\Model;

require_once __DIR__ . '/Model.php';
require_once __DIR__ . '/../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

class Transaction extends Model
{
    protected $tableName = 'transactions';

    public function importExcel($file)
    {
        try {
            $spreadsheet = IOFactory::load($file);
        } catch (\PhpOffice\PhpSpreadsheet\Reader\Exception $e) {
            die('Ошибка загрузки файла: ' . $e->getMessage());
        }

        $sheet = $spreadsheet->getActiveSheet();

        $this->clearTable();

        foreach ($sheet->getRowIterator() as $row) {
            $cellIterator = $row->getCellIterator();
            $cellIterator->setIterateOnlyExistingCells(false);

            $rowData = [];
            foreach ($cellIterator as $cell) {
                $rowData[] = $cell->getValue();
            }

            if ($row->getRowIndex() === 1) {
                continue;
            }

            $data = [
                'account' => $rowData[0],
                'transaction_no' => $rowData[1],
                'amount' => $rowData[2],
                'currency' => $rowData[3],
                'date' => $rowData[4],
            ];

            $query = sprintf(
                "INSERT INTO %s (account, transaction_no, amount, currency, date) 
            VALUES ('%s', '%s', '%s', '%s', '%s')",
                $this->tableName,
                $this->escapeString($data['account']),
                $this->escapeString($data['transaction_no']),
                $this->escapeString($data['amount']),
                $this->escapeString($data['currency']),
                $this->escapeString($data['date'])
            );

            $this->doQuery($query);
        }
    }

    public function getCurrencyRates()
    {
        $query = "SELECT currency, amount, date FROM {$this->tableName}";
        $result = $this->doQuery($query);

        $rates = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $rates[] = $row;
        }

        return $rates;
    }

    public function getCurrency()
    {
        $query = "SELECT DISTINCT currency FROM ";
        $result = $this->selectQuery($query);

        $rates = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $rates[] = $row['currency'];
        }
        return $rates;
    }

    public function getBankAccounts()
    {
        $query = "SELECT account, currency, 
       FIRST_VALUE(amount) OVER (PARTITION BY account ORDER BY date ASC) AS start_value,
       FIRST_VALUE(amount) OVER (PARTITION BY account ORDER BY date DESC) AS last_value
        FROM transactions GROUP BY account, currency ORDER BY account";
        $result = $this->selectOnlyQuery($query);

        $accounts = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $accounts[] = $row;
        }
        return $accounts;
    }

    public function updateAccountName($oldAccountName, $newAccountName)
    {
        $result = $this->updateByName('account', $oldAccountName, $newAccountName);
        return $result;
    }

    public function loadDataWithParams($params)
    {
        $page = $params['page'];
        $limit = $params['limit'];
        $sortBy = $params['sortBy'];
        $order = $params['order'];
        $offset = $params['offset'];

        $query = "SELECT * FROM transactions ORDER BY $sortBy $order LIMIT $limit OFFSET $offset";
        $result = $this->doQuery($query);

        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        $totalQuery = "SELECT COUNT(*) as total FROM transactions";
        $totalResult = $this->doQuery($totalQuery);
        $total = $totalResult->fetch_assoc()['total'];

        return [
            'data' => $data,
            'total' => $total,
            'page' => $page,
            'limit' => $limit
        ];
    }

    public function destroy($id)
    {
        $query = "DELETE FROM transactions WHERE id = {$id}";
        return $this->doQuery($query);
    }
}
