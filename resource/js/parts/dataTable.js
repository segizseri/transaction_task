export function initDataTable() {
    let currentPage = 1;
    let sortBy = 'id';
    let order = 'ASC';
    let perPage = 10;

    const tbody = document.querySelector('#data-table tbody');
    const pagination = document.querySelector('#pagination');
    const limit = document.getElementById('limit');
    const modal = document.getElementById('edit-modal');
    const overlay = document.getElementById('modal-overlay');
    const form = document.getElementById('edit-form');
    const inputId = document.getElementById('edit-id');
    const inputTransactionNo = document.getElementById('edit-transaction_no');
    const inputAmount = document.getElementById('edit-amount');
    const inputDate = document.getElementById('edit-date');
    const btnCancel = document.getElementById('edit-cancel');
    const exportExcel = document.getElementById('export-excel');
    const exportPdf = document.getElementById('export-pdf');

    limit.addEventListener('change', () => {
        perPage = parseInt(limit.value, 10);
        loadTable(1, sortBy, order);
    });

    async function loadTable(page = 1, sortField = 'id', sortOrder = 'ASC') {
        try {
            const response = await fetch(`http://localhost/b-booster/index.php?action=loadData&page=${page}&limit=${perPage}&sortBy=${sortField}&order=${sortOrder}`);
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
              <span class="edit-btn"
                data-id="${item.id}"
                data-transaction_no="${item.transaction_no}"
                data-amount="${item.amount}"
                data-date="${item.date}">
                  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9426 1.25L13.5 1.25C13.9142 1.25 14.25 1.58579 14.25 2C14.25 2.41421 13.9142 2.75 13.5 2.75H12C9.62178 2.75 7.91356 2.75159 6.61358 2.92637C5.33517 3.09825 4.56445 3.42514 3.9948 3.9948C3.42514 4.56445 3.09825 5.33517 2.92637 6.61358C2.75159 7.91356 2.75 9.62178 2.75 12C2.75 14.3782 2.75159 16.0864 2.92637 17.3864C3.09825 18.6648 3.42514 19.4355 3.9948 20.0052C4.56445 20.5749 5.33517 20.9018 6.61358 21.0736C7.91356 21.2484 9.62178 21.25 12 21.25C14.3782 21.25 16.0864 21.2484 17.3864 21.0736C18.6648 20.9018 19.4355 20.5749 20.0052 20.0052C20.5749 19.4355 20.9018 18.6648 21.0736 17.3864C21.2484 16.0864 21.25 14.3782 21.25 12V10.5C21.25 10.0858 21.5858 9.75 22 9.75C22.4142 9.75 22.75 10.0858 22.75 10.5V12.0574C22.75 14.3658 22.75 16.1748 22.5603 17.5863C22.366 19.031 21.9607 20.1711 21.0659 21.0659C20.1711 21.9607 19.031 22.366 17.5863 22.5603C16.1748 22.75 14.3658 22.75 12.0574 22.75H11.9426C9.63423 22.75 7.82519 22.75 6.41371 22.5603C4.96897 22.366 3.82895 21.9607 2.93414 21.0659C2.03933 20.1711 1.63399 19.031 1.43975 17.5863C1.24998 16.1748 1.24999 14.3658 1.25 12.0574V11.9426C1.24999 9.63423 1.24998 7.82519 1.43975 6.41371C1.63399 4.96897 2.03933 3.82895 2.93414 2.93414C3.82895 2.03933 4.96897 1.63399 6.41371 1.43975C7.82519 1.24998 9.63423 1.24999 11.9426 1.25ZM16.7705 2.27592C18.1384 0.908029 20.3562 0.908029 21.7241 2.27592C23.092 3.6438 23.092 5.86158 21.7241 7.22947L15.076 13.8776C14.7047 14.2489 14.4721 14.4815 14.2126 14.684C13.9069 14.9224 13.5761 15.1268 13.2261 15.2936C12.929 15.4352 12.6169 15.5392 12.1188 15.7052L9.21426 16.6734C8.67801 16.8521 8.0868 16.7126 7.68711 16.3129C7.28742 15.9132 7.14785 15.322 7.3266 14.7857L8.29477 11.8812C8.46079 11.3831 8.56479 11.071 8.7064 10.7739C8.87319 10.4239 9.07761 10.0931 9.31605 9.78742C9.51849 9.52787 9.7511 9.29529 10.1224 8.924L16.7705 2.27592ZM20.6634 3.33658C19.8813 2.55448 18.6133 2.55448 17.8312 3.33658L17.4546 3.7132C17.4773 3.80906 17.509 3.92327 17.5532 4.05066C17.6965 4.46372 17.9677 5.00771 18.48 5.51999C18.9923 6.03227 19.5363 6.30346 19.9493 6.44677C20.0767 6.49097 20.1909 6.52273 20.2868 6.54543L20.6634 6.16881C21.4455 5.38671 21.4455 4.11867 20.6634 3.33658ZM19.1051 7.72709C18.5892 7.50519 17.9882 7.14946 17.4193 6.58065C16.8505 6.01185 16.4948 5.41082 16.2729 4.89486L11.2175 9.95026C10.801 10.3668 10.6376 10.532 10.4988 10.7099C10.3274 10.9297 10.1804 11.1676 10.0605 11.4192C9.96337 11.623 9.88868 11.8429 9.7024 12.4017L9.27051 13.6974L10.3026 14.7295L11.5983 14.2976C12.1571 14.1113 12.377 14.0366 12.5808 13.9395C12.8324 13.8196 13.0703 13.6726 13.2901 13.5012C13.468 13.3624 13.6332 13.199 14.0497 12.7825L19.1051 7.72709Z" fill="#1C274C"/>
                  </svg>
              </span>
              <span class="delete-btn" data-id="${item.id}">
                  <svg  width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
              </span>
            </td>`;
            tbody.appendChild(row);
        });
        addEventListeners();
    }

    function addEventListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const { id, transaction_no, amount, date } = btn.dataset;

                inputId.value = id;
                inputTransactionNo.value = transaction_no;
                inputAmount.value = amount;
                inputDate.value = date;

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

    exportExcel.addEventListener('click', (e) => {
        exportToExcel().then(r => {
            alert('Excel успешно загружен')
        })
    });

    exportPdf.addEventListener('click', (e) => {
        exportToPDF().then(r => {
            alert('PDF успешно загружен')
        })
    });

    async function getAllData() {
        const response = await fetch('http://localhost/b-booster/index.php?action=getAllData')
            .then(res => res.json());

        if (!response || response.length === 0) {
            alert('Нет данных!');
        }
        return response;
    }

    async function exportToExcel() {
        const data = await getAllData();
        const worksheetData = [
            ['Account', 'Transaction No', 'Amount', 'Currency', 'Date'],
            ...data.map(item => [item.account, item.transaction_no, item.amount, item.currency, item.date])
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
        XLSX.writeFile(workbook, 'transactions.xlsx');
    }

    async function exportToPDF() {
        const data = await getAllData();

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const headers = ['Account', 'Transaction No', 'Amount', 'Currency', 'Date'];
        const rows = data.map(item => [
            item.account,
            item.transaction_no,
            item.amount,
            item.currency,
            item.date
        ]);

        doc.autoTable({
            head: [headers],
            body: rows,
            startY: 10,
        });

        doc.save('transactions.pdf');
    }

    loadTable().then(r => {
        console.log(r)
    });
}