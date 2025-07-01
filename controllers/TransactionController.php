<?php

use App\Services\CurrencyService;

require_once __DIR__ . '/../models/Transaction.php';
require_once __DIR__ . '/../services/CurrencyService.php';

class TransactionController
{
    private $model;

    public function __construct()
    {
        $this->model = new Transaction();
    }

    public function upload()
    {
        if ($_FILES['file']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['file']['tmp_name'];
            $this->model->importExcel($file);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Ошибка загрузки файла']);
        }
    }

    /**
     * @throws Exception
     */
    public function getCurrencyRates()
    {
        $currencyService = new CurrencyService();
        $currencyCodes = $this->model->getCurrency();
        $rates = $currencyService->getRates($currencyCodes);
        echo json_encode($rates);
    }
    public function getBankAccounts()
    {
        $bankAccounts = $this->model->getBankAccounts();
        echo json_encode($bankAccounts);
    }

    public function updateAccount()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['oldAccount']) || !isset($input['newAccount'])) {
            echo json_encode(['success' => false, 'message' => 'Недостаточно данных']);
            return;
        }

        $oldAccountName = trim($input['oldAccount']);
        $newAccountName = trim($input['newAccount']);
        $this->model->updateAccountName($oldAccountName, $newAccountName);
        echo json_encode('success');
    }

    public function getAllData() {
        return $this->model->getAll();
    }

    /**
     * @throws Exception
     */
    public function getChart()
    {
        $transactions = $this->getAllData();
        $groupedData = [];
        foreach ($transactions as $transaction) {
            $date = new DateTime($transaction['date']);
            $month = $date->format('F'); // Название месяца
            $account = $transaction['account'];

            if (!isset($groupedData[$account][$month])) {
                $groupedData[$account][$month] = 0;
            }

            $groupedData[$account][$month] += $transaction['amount'];
        }

        $labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        $datasets = [];

        foreach ($groupedData as $account => $data) {
            $dataset = [
                'label' => $account,
                'data' => [],
                'fill' => false,
                'borderColor' => $this->generateColor(),
                'borderWidth' => 3,
            ];

            foreach ($labels as $month) {
                $dataset['data'][] = isset($data[$month]) ? $data[$month] : 0;
            }

            $datasets[] = $dataset;
        }

        $chartData = [
            'labels' => $labels,
            'datasets' => $datasets,
        ];

        echo json_encode($chartData);
    }

    private function generateColor()
    {
        $r = rand(0, 255);
        $g = rand(0, 255);
        $b = rand(0, 255);
        return "rgb($r, $g, $b)";
    }

    public function loadData()
    {
        $params = [];
        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
        $params['limit'] = $limit;
        $params['page'] = $page;
        $params['sortBy'] = isset($_GET['sortBy']) ? $_GET['sortBy'] : 'id';
        $params['order'] = isset($_GET['order']) ? $_GET['order'] : 'ASC';
        $params['offset'] = ($page - 1) * $limit;
        $result = $this->model->loadDataWithParams($params);
        header('Content-Type: application/json');
        echo json_encode($result);
    }

    public function deleteRecord()
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if (!isset($data['id']) || !is_numeric($data['id'])) {
            echo json_encode([
                'success' => false,
                'message' => 'Некорректный или отсутствующий ID'
            ]);
            return;
        }

        $id = intval($data['id']);
        $result = $this->model->destroy($id);

        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Запись успешно удалена'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Ошибка при удалении записи'
            ]);
        }
    }

    public function updateRecord()
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if (!isset($data['id'], $data['transaction_no'], $data['amount'], $data['date'])) {
            echo json_encode(['success' => false, 'message' => 'Некорректные данные']);
            return;
        }

        $id = intval($data['id']);
        $transactionNo = $data['transaction_no'];
        $amount = floatval($data['amount']);
        $date = $data['date'];
        $fields = [
            'transaction_no' => $transactionNo,
            'amount' => $amount,
            'date' => $date
        ];

        $result = $this->model->update($id, $fields);

        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Запись обновлена']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Ошибка при обновлении']);
        }
    }

}
