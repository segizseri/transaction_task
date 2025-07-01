<?php

namespace App\Models;

class Model
{
    private $connection;
    protected $tableName = '';

    public function __construct()
    {
        $host = '127.0.0.1';
        $dbname = 'bbdb';
        $user = 'root';
        $password = '';

        $this->connection = mysqli_connect($host, $user, $password, $dbname);

        if (!$this->connection) {
            die('Ошибка подключения: ' . mysqli_connect_error());
        }
    }

    public function getAll()
    {
        if (!$this->tableName) {
            die('Таблица не задана');
        }
        $query = 'SELECT * FROM ' . $this->tableName;
        $result = mysqli_query($this->connection, $query);

        if (!$result) {
            die('Ошибка выполнения запроса: ' . mysqli_error($this->connection));
        }

        $data = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }

        return $data;
    }

    public function __destruct()
    {
        mysqli_close($this->connection);
    }

    public function clearTable()
    {
        $query = 'TRUNCATE TABLE ' . $this->tableName;
        mysqli_query($this->connection, $query);
    }

    protected function doQuery($query)
    {
       return mysqli_query($this->connection, $query);
    }

    protected function escapeString($value)
    {
        return mysqli_real_escape_string($this->connection, $value);
    }

    public function selectQuery($selectQuery = null)
    {
        if (!$this->tableName) {
            die('Таблица не задана');
        }
        $query = $selectQuery . $this->tableName;
        return mysqli_query($this->connection, $query);
    }

    public function selectOnlyQuery($selectQuery = null)
    {
        if (!$selectQuery) {
            die('Запрос отсутствует');
        }
        return mysqli_query($this->connection, $selectQuery);
    }

    public function updateByName($field, $oldValue, $newValue)
    {
        $allowedFields = ['account', 'currency', 'amount', 'date'];
        if (!in_array($field, $allowedFields)) {
            error_log("Поле нету: $field");
            return false;
        }
        $query = "UPDATE transactions SET $field = ? WHERE $field = ?";

        $stmt = $this->connection->prepare($query);
        if (!$stmt) {
            error_log("Ошибка подготовки запроса: " . $this->connection->error);
            return false;
        }

        $stmt->bind_param('ss', $newValue, $oldValue);
        $success = $stmt->execute();
        if (!$success) {
            error_log("Ошибка выполнения запроса: " . $stmt->error);
            return false;
        }
        $stmt->close();
        return $success;
    }

    public function update($id, $fields)
    {
        $setParts = [];
        foreach ($fields as $column => $value) {
            $setParts[] = "$column = '$value'";
        }
        if (!$this->tableName) {
            die('Таблица не задана');
        }

        if (!$id) {
            die('ID не задана');
        }

        $setClause = implode(', ', $setParts);
        $query = "UPDATE $this->tableName SET $setClause WHERE id = $id";
        return $this->doQuery($query);
    }

}
