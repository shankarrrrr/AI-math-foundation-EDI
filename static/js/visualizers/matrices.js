function createMatrixInputs(id, rows = 3, cols = 3) {
    const container = document.getElementById(id);
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-cell';
            input.value = (i === j) ? 1 : 0; // Identity default
            input.dataset.row = i;
            input.dataset.col = j;
            container.appendChild(input);
        }
    }
}

function getMatrixValues(id, rows = 3, cols = 3) {
    const container = document.getElementById(id);
    const inputs = container.querySelectorAll('input');
    let matrix = [];
    let row = [];

    inputs.forEach((input, index) => {
        row.push(parseFloat(input.value) || 0);
        if ((index + 1) % cols === 0) {
            matrix.push(row);
            row = [];
        }
    });
    return matrix;
}

function renderResultMatrix(matrix) {
    const container = document.getElementById('matrixResult');
    container.innerHTML = '';
    const rows = matrix.length;
    const cols = matrix[0].length;

    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    matrix.forEach(row => {
        row.forEach(val => {
            const div = document.createElement('div');
            div.className = 'result-cell';
            div.textContent = parseFloat(val).toFixed(2);
            container.appendChild(div);
        });
    });
}

function calculate(operation) {
    const m1 = getMatrixValues('matrixA');
    const m2 = getMatrixValues('matrixB');

    const payload = {
        operation: operation,
        m1: m1,
        m2: (['add', 'subtract', 'multiply'].includes(operation)) ? m2 : null
    };

    fetch('/api/calculate_matrices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(data => {
            const resultSection = document.getElementById('result-section');
            const matrixResult = document.getElementById('matrixResult');
            const textResult = document.getElementById('textResult');

            resultSection.style.display = 'block';
            matrixResult.innerHTML = '';
            textResult.innerHTML = '';

            if (data.error) {
                textResult.innerHTML = `<span style="color: #ef4444;">Error: ${data.error}</span>`;
            } else if (data.matrix) {
                renderResultMatrix(data.matrix);
            } else if (data.value !== undefined) {
                textResult.innerHTML = `<h3>${data.value}</h3><p>${data.explanation}</p>`;
            }
        })
        .catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', () => {
    createMatrixInputs('matrixA');
    createMatrixInputs('matrixB');
});
