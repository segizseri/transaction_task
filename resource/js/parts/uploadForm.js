export function initUploadForm() {
    document.getElementById('upload-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        fetch('http://localhost/b-booster/index.php?action=upload', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                const resultDiv = document.getElementById('upload-result');
                resultDiv.textContent = data.success ? 'Файл успешно загружен' : 'Ошибка: ' + data.message;
            });
    });
}