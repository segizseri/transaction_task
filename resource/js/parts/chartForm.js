export function initChart() {
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
                        legend: { display: true, position: 'bottom' }
                    }
                }
            });
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));
}
