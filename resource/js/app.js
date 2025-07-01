document.getElementById('upload-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch('http://localhost/b-booster/index.php?action=upload', {
        method: 'POST',
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            const resultDiv = document.getElementById('upload-result');
            if (data.success) {
                resultDiv.textContent = 'Файл успешно загружен';
            } else {
                resultDiv.textContent = 'Ошибка: ' + data.message;
            }
        });
});

function loadCurrencyRates() {
    fetch('http://localhost/b-booster/index.php?action=getCurrencyRates')
        .then((response) => response.json())
        .then((data) => {
            const tbody = document.querySelector('#currency-table tbody');
            tbody.innerHTML = '';

            data.forEach((rate) => {
                const row = `<tr>
                    <td>${rate.currency}</td>
                    <td>${rate.amount}</td>
                </tr>`;
                tbody.innerHTML += row;
            });
        });
}
document.querySelectorAll('#bank-accounts thead th').forEach(th => {
    th.addEventListener('click', () => {
        const fieldMap = {
            0: 'account',
            1: 'currency',
            2: 'start_value',
            3: 'last_value',
            4: 'last_value'
        };
        const index = Array.from(th.parentNode.children).indexOf(th);
        const field = fieldMap[index];
        if (!field) return;
        if (!window.sortState) {
            window.sortState = {};
        }
        if (window.sortState.field === field) {
            window.sortState.direction = window.sortState.direction === 'asc' ? 'desc' : 'asc';
        } else {
            window.sortState.field = field;
            window.sortState.direction = 'asc';
        }

        loadBankAccounts(window.sortState.field, window.sortState.direction);
    });
});

function loadBankAccounts(sortField = null, sortDirection = 'asc') {
    fetch('http://localhost/b-booster/index.php?action=getBankAccounts')
        .then((response) => response.json())
        .then((data) => {
            if (sortField) {
                data.sort((a, b) => {
                    let valA = a[sortField];
                    let valB = b[sortField];
                    if (!isNaN(valA) && !isNaN(valB)) {
                        valA = Number(valA);
                        valB = Number(valB);
                    } else {
                        valA = valA.toString().toLowerCase();
                        valB = valB.toString().toLowerCase();
                    }
                    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
                    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
                    return 0;
                });
            }

            const tbody = document.querySelector('#bank-accounts tbody');
            tbody.innerHTML = '';

            data.forEach((rate, index) => {
                let chfValue = 0;
                if (rate.currency === 'CHF') {
                    chfValue = rate.last_value;
                }

                const tr = document.createElement('tr');
                const tdAccount = document.createElement('td');
                const inputAccount = document.createElement('input');
                inputAccount.type = 'text';
                inputAccount.value = rate.account;
                inputAccount.dataset.index = index;
                inputAccount.addEventListener('change', (e) => {

                    updateAccount(rate.account, e.target.value)
                    data[e.target.dataset.index].account = e.target.value;
                });
                tdAccount.appendChild(inputAccount);
                tr.appendChild(tdAccount);

                const tdCurrency = document.createElement('td');
                tdCurrency.textContent = rate.currency;
                tr.appendChild(tdCurrency);

                const tdStartValue = document.createElement('td');
                tdStartValue.textContent = rate.start_value;
                tr.appendChild(tdStartValue);

                const tdLastValue = document.createElement('td');
                tdLastValue.textContent = rate.last_value;
                tr.appendChild(tdLastValue);

                const tdChfValue = document.createElement('td');
                tdChfValue.textContent = chfValue;
                tr.appendChild(tdChfValue);

                tbody.appendChild(tr);
            });
        });
}

function updateAccount(oldAccountName, newAccountName) {
    fetch('http://localhost/b-booster/index.php?action=updateAccount', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({oldAccount: oldAccountName, newAccount: newAccountName})
    })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                console.log('Обновлено успешно');
            } else {
                alert('Ошибка: ' + response.message);
            }
        });
}
document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById('block-4').getContext('2d');
    fetch('http://localhost/b-booster/index.php?action=getChart')
        .then(response => response.json())
        .then(data => {
            new Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));
});
document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1;
    let sortBy = 'id';
    let order = 'ASC';

    const tbody = document.querySelector('#data-table tbody');
    const pagination = document.querySelector('#pagination');

    const modal = document.getElementById('edit-modal');
    const overlay = document.getElementById('modal-overlay');
    const form = document.getElementById('edit-form');
    const inputId = document.getElementById('edit-id');
    const inputTransactionNo = document.getElementById('edit-transaction_no');
    const inputAmount = document.getElementById('edit-amount');
    const inputDate = document.getElementById('edit-date');
    const btnCancel = document.getElementById('edit-cancel');

    async function loadTable(page = 1, sortField = 'id', sortOrder = 'ASC') {
        try {
            const response = await fetch(`http://localhost/b-booster/index.php?action=loadData&page=${page}&limit=10&sortBy=${sortField}&order=${sortOrder}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            renderTable(data.data);
            renderPagination(data.total, data.page, data.limit);
            currentPage = data.page;
        } catch (error) {
            console.error('Ошибка загрузки таблицы:', error);
        }
    }

    function renderTable(data) {
        tbody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.account}</td>
            <td>${item.transaction_no}</td>
            <td>${item.amount}</td>
            <td>${item.currency}</td>
            <td>${item.date}</td>
            <td>
              <button class="edit-btn"
                data-id="${item.id}"
                data-transaction_no="${item.transaction_no}"
                data-amount="${item.amount}"
                data-date="${item.date}">
                Edit
              </button>
              <button class="delete-btn" data-id="${item.id}">Delete</button>
            </td>`;
            tbody.appendChild(row);
        });
        addEventListeners();
    }

    function addEventListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                inputId.value = btn.getAttribute('data-id');
                inputTransactionNo.value = btn.getAttribute('data-transaction_no');
                inputAmount.value = btn.getAttribute('data-amount');
                inputDate.value = btn.getAttribute('data-date');
                openModal();
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm(`Удалить запись с ID ${id}?`)) {
                    deleteRecord(id);
                }
            });
        });
    }

    function openModal() {
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = inputId.value.trim();
        const transactionNo = inputTransactionNo.value;
        const amount = parseFloat(inputAmount.value);
        const date = inputDate.value.trim();

        if (!id || !transactionNo || isNaN(amount) || !date) {
            alert('Заполните все поля.');
            return;
        }

        try {
            const response = await fetch('http://localhost/b-booster/index.php?action=updateRecord', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, transaction_no: transactionNo, amount, date })
            });

            const result = await response.json();

            if (result.success) {
                alert('Запись успешно обновлена');
                closeModal();
                // Обновляем таблицу
                loadTable(currentPage, sortBy, order);
            } else {
                alert('Ошибка обновления: ' + result.message);
            }
        } catch (error) {
            console.error('Ошибка отправки данных:', error);
        }
    });


    btnCancel.addEventListener('click', () => {
        closeModal();
    });

    overlay.addEventListener('click', () => {
        closeModal();
    });

    function renderPagination(total, page, limit) {
        pagination.classList.add('pagination');
        pagination.innerHTML = '';

        const totalPages = Math.ceil(total / limit);
        const maxPagesToShow = 6;
        let startPage = 1;
        let endPage = totalPages;

        if (totalPages > maxPagesToShow) {
            const half = Math.floor(maxPagesToShow / 2);
            if (page <= half) {
                startPage = 1;
                endPage = maxPagesToShow;
            } else if (page + half >= totalPages) {
                startPage = totalPages - maxPagesToShow + 1;
                endPage = totalPages;
            } else {
                startPage = page - half;
                endPage = page + half - 1;
            }
        }

        if (startPage > 1) {
            const first = document.createElement('a');
            first.href = '#';
            first.textContent = 'Begin';
            first.addEventListener('click', e => {
                e.preventDefault();
                loadTable(1);
            });
            pagination.appendChild(first);
        }

        if (page > 1) {
            const prev = document.createElement('a');
            prev.href = '#';
            prev.textContent = 'Previous';
            prev.addEventListener('click', e => {
                e.preventDefault();
                loadTable(page - 1);
            });
            pagination.appendChild(prev);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.textContent = i;
            pageLink.classList.add('page-link');
            if (i === page) pageLink.classList.add('active');
            pageLink.addEventListener('click', (e) => {
                e.preventDefault();
                loadTable(i);
            });
            pagination.appendChild(pageLink);
        }

        if (page < totalPages) {
            const next = document.createElement('a');
            next.href = '#';
            next.textContent = 'Next';
            next.addEventListener('click', e => {
                e.preventDefault();
                loadTable(page + 1);
            });
            pagination.appendChild(next);
        }

        if (endPage < totalPages) {
            const last = document.createElement('a');
            last.href = '#';
            last.textContent = 'Last';
            last.addEventListener('click', e => {
                e.preventDefault();
                loadTable(totalPages);
            });
            pagination.appendChild(last);
        }
    }

    async function deleteRecord(id) {
        try {
            const response = await fetch('http://localhost/b-booster/index.php?action=deleteRecord', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id})
            });
            const result = await response.json();
            if (result.success) {
                alert('Запись удалена');
                loadTable(currentPage, sortBy, order);
            } else {
                alert('Ошибка удаления: ' + result.message);
            }
        } catch (error) {
            console.error('Ошибка удаления:', error);
        }
    }

    document.querySelectorAll('#data-table th a').forEach(header => {
        header.addEventListener('click', (e) => {
            e.preventDefault();
            const sortField = header.getAttribute('data-sort');
            order = (sortBy === sortField && order === 'ASC') ? 'DESC' : 'ASC';
            sortBy = sortField;
            loadTable(currentPage, sortBy, order);
        });
    });

    loadTable();
});

loadCurrencyRates();
loadBankAccounts();