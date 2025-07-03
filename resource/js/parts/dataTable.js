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