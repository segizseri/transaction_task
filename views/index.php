<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="resource/css/app.css">
    <title>Transaction Manager</title>
</head>
<body>
<div class="wrapper">
    <div class="section-one">
        <div id="upload-section" class="upload-section">
            <form id="upload-form" enctype="multipart/form-data">
                <label for="file" class="custom-file-label">Browse files</label>
                <input type="file" name="file" id="file" class="file_upload_btn">
                <button type="submit">File upload</button>
            </form>
            <div id="upload-result">
            </div>
        </div>

        <div id="currency-section" class="currency-section">
            <h2>Currency FX RATES</h2>
            <table id="currency-table">
                <thead>
                <tr>
                    <th>Currency</th>
                    <th>FX Rate</th>
                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
    <div class="section">
        <h2>List of bank accounts</h2>
        <div class="container">
            <table id="bank-accounts">
                <thead>
                <tr>
                    <th class="sortable">Banks</th>
                    <th class="sortable">Currency</th>
                    <th class="sortable">Starting balance</th>
                    <th class="sortable">End balance</th>
                    <th class="sortable">End balance (CHF)</th>
                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
    <div class="section">
        <h2>Cash forecast</h2>
        <div class="container">
            <canvas id="block-4"></canvas>
        </div>
    </div>
    <div class="section">
        <h2>List of bank accounts</h2>
        <div class="container" id="crud-app">
            <div class="pagination_wrapper">
                <div id="per-page">
                    <label for="limit">Show</label>
                    <select id="limit" class="select-box">
                        <option value="5">5</option>
                        <option value="10" selected>10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                    <span>entries</span>
                </div>
                <div id="pagination" class="pagination"></div>
            </div>
            <div class="export-wrapper">
                <label>
                    Export full table
                </label>
                <div>
                    <button type="button" id="export-excel" class="export-btn">Excel</button>
                    <button type="button" id="export-pdf" class="export-btn">PDF</button>
                </div>
            </div>
            <table id="data-table">
                <thead>
                <tr>
                    <th class="sortable"><a href="#" data-sort="id">ID</a></th>
                    <th class="sortable"><a href="#" data-sort="account">Account</a></th>
                    <th class="sortable"><a href="#" data-sort="transaction_no">Transaction No</a></th>
                    <th class="sortable"><a href="#" data-sort="amount">Amount</a></th>
                    <th class="sortable"><a href="#" data-sort="currency">Currency</a></th>
                    <th class="sortable"><a href="#" data-sort="date">Date</a></th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody></tbody>
            </table>

            <div id="edit-modal" class="edit-modal">
                <h3 class="mb-3">Редактировать запись</h3>
                <form id="edit-form" enctype="multipart/form-data">
                    <input type="hidden" id="edit-id" />
                    <div class="mb-3">
                        <label for="edit-transaction_no" class="form-label">Transaction No:</label>
                        <input type="text" id="edit-transaction_no" class="form-control" />
                    </div>
                    <div class="mb-3">
                        <label for="edit-amount" class="form-label">Amount:</label>
                        <input type="number" step="0.01" id="edit-amount" class="form-control"/>
                    </div>
                    <div class="mb-3">
                        <label for="edit-date" class="form-label">Date (YYYY-MM-DD):</label>
                        <input type="date" id="edit-date" class="form-control" pattern="\d{4}-\d{2}-\d{2}" />
                    </div>
                    <div class="gap-2">
                        <button type="submit" id="submit" class="submit-btn">Сохранить</button>
                        <button type="button" id="edit-cancel" class="edit-cancel">Отмена</button>
                    </div>
                </form>
            </div>

            <div id="modal-overlay" class="modal"></div>
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script type="module" src="resource/js/app.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>

</body>
</html>
