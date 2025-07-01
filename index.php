<?php

require_once __DIR__ . '/controllers/TransactionController.php';
error_reporting(E_ALL);
ini_set('display_errors', 1);

$controller = new TransactionController();

if (isset($_GET['action']) && $_GET['action'] === 'upload') {
    $controller->upload();
} elseif (isset($_GET['action']) && $_GET['action'] === 'getCurrencyRates') {
    $controller->getCurrencyRates();
} elseif (isset($_GET['action']) && $_GET['action'] === 'getBankAccounts') {
    $controller->getBankAccounts();
} elseif (isset($_GET['action']) && $_GET['action'] === 'updateAccount') {
    $controller->updateAccount();
} elseif (isset($_GET['action']) && $_GET['action'] === 'getChart') {
    $controller->getChart();
} elseif (isset($_GET['action']) && $_GET['action'] === 'deleteRecord') {
    $controller->deleteRecord();
} elseif (isset($_GET['action']) && $_GET['action'] === 'updateRecord') {
    $controller->updateRecord();
} elseif (isset($_GET['action']) && strpos($_GET['action'], 'loadData') !== false) {
    $controller->loadData();
} else {
    require_once __DIR__ . '/views/index.php';
}
