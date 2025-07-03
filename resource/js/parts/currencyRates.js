export function loadCurrencyRates() {
    fetch('http://localhost/b-booster/index.php?action=getCurrencyRates')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#currency-table tbody');
            tbody.innerHTML = '';
            data.forEach(rate => {
                tbody.innerHTML += `
                    <tr>
                        <td>${rate.currency}</td>
                        <td>${rate.amount}</td>
                    </tr>`;
            });
        });
}