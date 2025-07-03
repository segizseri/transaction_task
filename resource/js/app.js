import { initUploadForm } from './parts/uploadForm.js';
import { loadCurrencyRates } from './parts/currencyRates.js';
import { initBankAccountsSorting, loadBankAccounts } from './parts/bankAccounts.js';
import { initChart } from './parts/chartForm.js';
import { initDataTable } from './parts/dataTable.js';

document.addEventListener('DOMContentLoaded', () => {
    initUploadForm();
    loadCurrencyRates();
    initBankAccountsSorting();
    loadBankAccounts();
    initChart();
    initDataTable();
});