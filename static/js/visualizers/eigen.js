function setEigenPreset(type) {
    const inputs = [
        document.getElementById('e00'), document.getElementById('e01'),
        document.getElementById('e10'), document.getElementById('e11')
    ];
    if (type === 'scale') {
        inputs[0].value = 2; inputs[1].value = 0;
        inputs[2].value = 0; inputs[3].value = 1; // Stretch X by 2, Y by 1
    } else if (type === 'shear') {
        inputs[0].value = 1; inputs[1].value = 1;
        inputs[2].value = 0; inputs[3].value = 1;
    }
    updateEigen();
}

function updateEigen() {
    const matrix = [
        [parseFloat(document.getElementById('e00').value), parseFloat(document.getElementById('e01').value)],
        [parseFloat(document.getElementById('e10').value), parseFloat(document.getElementById('e11').value)]
    ];

    fetch('/api/calculate_eigen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matrix: matrix })
    })
        .then(res => res.json())
        .then(data => {
            if (!data.error) {
                renderEigenPlot(data);
                renderEigenMath(data);
            }
        });
}

function renderEigenMath(data) {
    const div = document.getElementById('eigenMath');
    const l1 = data.eigenvalues[0];
    const l2 = data.eigenvalues[1];

    // Check for complex eigenvalues
    let l1Text = typeof l1 === 'object' ? `${l1[0].toFixed(2)} + ${l1[1].toFixed(2)}i` : l1.toFixed(2);
    let l2Text = typeof l2 === 'object' ? `${l2[0].toFixed(2)} + ${l2[1].toFixed(2)}i` : l2.toFixed(2);

    if (typeof l1 === 'number') {
        div.innerHTML = `
            <p><strong>Eigenvalue λ₁:</strong> ${l1.toFixed(2)}</p>
            <p><strong>Eigenvalue λ₂:</strong> ${l2.toFixed(2)}</p>
            <p style="font-size: 0.9rem; margin-top: 0.5rem; color: var(--text-muted);">
                These values represent the stretch factor along the eigenvectors.
            </p>
        `;
    } else {
        div.innerHTML = `
            <p><strong>Complex Eigenvalues detected.</strong> This corresponds to rotation.</p>
            <p>λ₁: ${l1.real.toFixed(2)} + ${l1.imag.toFixed(2)}i</p>
        `;
    }
}

function renderEigenPlot(data) {
    const traces = [];

    // Generate Unit Circle Points
    const theta = [];
    const N = 100;
    for (let i = 0; i <= N; i++) theta.push((2 * Math.PI * i) / N);

    const circleX = theta.map(Math.cos);
    const circleY = theta.map(Math.sin);

    // 1. Original Unit Circle
    traces.push({
        x: circleX,
        y: circleY,
        mode: 'lines',
        line: { color: '#94a3b8', dash: 'dot' },
        name: 'Unit Circle'
    });

    // 2. Transformed Circle (Ellipse)
    const tX = [];
    const tY = [];
    const mat = data.matrix;

    for (let i = 0; i <= N; i++) {
        const x = circleX[i];
        const y = circleY[i];
        // Ax
        tX.push(mat[0][0] * x + mat[0][1] * y);
        tY.push(mat[1][0] * x + mat[1][1] * y);
    }

    traces.push({
        x: tX,
        y: tY,
        mode: 'lines',
        line: { color: '#3b82f6', width: 3 },
        name: 'Transformed Space'
    });

    // 3. Eigenvectors
    // Only plot if real
    if (typeof data.eigenvalues[0] === 'number') {
        data.eigenvectors.forEach((vec, idx) => {
            const lambda = data.eigenvalues[idx];
            // Normalize for visual length (optional, but convenient)
            // But we want to show them as vectors.

            // Vector Line
            traces.push({
                x: [0, vec[0] * lambda * 1.5], // Extend a bit
                y: [0, vec[1] * lambda * 1.5],
                mode: 'lines+markers',
                line: { color: idx === 0 ? '#facc15' : '#f472b6', width: 4 },
                marker: { size: 8 },
                name: `Eigenvector v${idx + 1}`
            });
        });
    }

    const layout = {
        title: 'Transformation of Unit Circle',
        xaxis: { range: [-5, 5], zeroline: true },
        yaxis: { range: [-5, 5], zeroline: true, scaleanchor: "x", scaleratio: 1 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: 'white' }
    };

    Plotly.newPlot('eigenPlot', traces, layout);
}

document.addEventListener('DOMContentLoaded', updateEigen);
