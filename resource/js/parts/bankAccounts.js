export function initBankAccountsSorting() {
    document.querySelectorAll('#bank-accounts thead th').forEach(th => {
        th.addEventListener('click', () => {
            const fieldMap = {0: 'account', 1: 'currency', 2: 'start_value', 3: 'last_value', 4: 'last_value'};
            const index = Array.from(th.parentNode.children).indexOf(th);
            const field = fieldMap[index];
            if (!field) return;

            if (!window.sortState) window.sortState = {};

            if (window.sortState.field === field) {
                window.sortState.direction = window.sortState.direction === 'asc' ? 'desc' : 'asc';
            } else {
                window.sortState.field = field;
                window.sortState.direction = 'asc';
            }

            loadBankAccounts(window.sortState.field, window.sortState.direction);
        });
    });
}

export function loadBankAccounts(sortField = null, sortDirection = 'asc') {
    fetch('http://localhost/b-booster/index.php?action=getBankAccounts')
        .then(response => response.json())
        .then(data => {
            if (sortField) {
                data.sort((a, b) => {
                    let valA = a[sortField], valB = b[sortField];
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
                const tr = document.createElement('tr');

                const tdAccount = document.createElement('td');
                const inputAccount = document.createElement('input');
                inputAccount.type = 'text';
                inputAccount.value = rate.account;
                inputAccount.dataset.index = index;
                inputAccount.addEventListener('change', (e) => {
                    updateAccount(rate.account, e.target.value);
                    data[e.target.dataset.index].account = e.target.value;
                });
                tdAccount.appendChild(inputAccount);
                tr.appendChild(tdAccount);

                tr.appendChild(createTd(rate.currency));
                tr.appendChild(createTd(rate.start_value));
                tr.appendChild(createTd(rate.last_value));
                tr.appendChild(createTd(rate.currency === 'CHF' ? rate.last_value : 0));

                tbody.appendChild(tr);
            });
        });
}

function createTd(text) {
    const td = document.createElement('td');
    td.textContent = text;
    return td;
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