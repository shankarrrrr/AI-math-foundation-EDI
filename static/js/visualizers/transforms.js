function setPreset(type) {
    const inputs = [
        document.getElementById('t00'),
        document.getElementById('t01'),
        document.getElementById('t10'),
        document.getElementById('t11')
    ];

    if (type === 'identity') {
        inputs[0].value = 1; inputs[1].value = 0;
        inputs[2].value = 0; inputs[3].value = 1;
    } else if (type === 'rotate') {
        const theta = Math.PI / 4; // 45 deg
        inputs[0].value = Math.cos(theta).toFixed(3); inputs[1].value = -Math.sin(theta).toFixed(3);
        inputs[2].value = Math.sin(theta).toFixed(3); inputs[3].value = Math.cos(theta).toFixed(3);
    } else if (type === 'scale') {
        inputs[0].value = 2; inputs[1].value = 0;
        inputs[2].value = 0; inputs[3].value = 0.5;
    } else if (type === 'shear') {
        inputs[0].value = 1; inputs[1].value = 1; // Shear factor 1
        inputs[2].value = 0; inputs[3].value = 1;
    } else if (type === 'reflect') {
        inputs[0].value = -1; inputs[1].value = 0;
        inputs[2].value = 0; inputs[3].value = 1;
    }
    updateTransform();
}

function updateTransform() {
    const matrix = [
        [parseFloat(document.getElementById('t00').value), parseFloat(document.getElementById('t01').value)],
        [parseFloat(document.getElementById('t10').value), parseFloat(document.getElementById('t11').value)]
    ];
    const shape = document.getElementById('shapeSelect').value;

    fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matrix: matrix, shape: shape })
    })
        .then(res => res.json())
        .then(data => {
            if (!data.error) {
                renderTransformPlot(data);
            }
        });
}

function renderTransformPlot(data) {
    const orig = data.original;
    const trans = data.transformed;

    const traceOriginal = {
        x: orig[0],
        y: orig[1],
        mode: 'lines+markers',
        type: 'scatter',
        name: 'Original',
        line: { color: '#94a3b8', dash: 'dot', width: 2 },
        marker: { color: '#94a3b8', size: 6 }
    };

    const traceTransformed = {
        x: trans[0],
        y: trans[1],
        mode: 'lines+markers',
        type: 'scatter',
        name: 'Transformed',
        fill: 'toself', // Fill shape
        line: { color: '#3b82f6', width: 4 },
        marker: { color: '#3b82f6', size: 8 }
    };

    // Basis Vectors Visualization (Standard Basis vs Transformed Basis)
    // i-hat (1,0) -> Column 1 of Matrix
    // j-hat (0,1) -> Column 2 of Matrix
    // We can add arrows for these later for more intuition, but let's stick to shapes first.

    const layout = {
        xaxis: {
            range: [-5, 5],
            zeroline: true,
            dtick: 1,
            gridcolor: '#334155',
            zerolinecolor: '#fff',
        },
        yaxis: {
            range: [-5, 5],
            zeroline: true,
            dtick: 1,
            gridcolor: '#334155',
            zerolinecolor: '#fff',
            scaleanchor: "x",
            scaleratio: 1,
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#f1f5f9' },
        showlegend: true,
        dragmode: 'pan' // Allow panning
    };

    Plotly.newPlot('transformPlot', [traceOriginal, traceTransformed], layout, {
        scrollZoom: true,
        displayModeBar: true
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateTransform();
});
