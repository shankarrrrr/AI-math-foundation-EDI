function updateVectors() {
    const v1 = [
        parseFloat(document.getElementById('ax').value) || 0,
        parseFloat(document.getElementById('ay').value) || 0,
        parseFloat(document.getElementById('az').value) || 0
    ];

    const v2 = [
        parseFloat(document.getElementById('bx').value) || 0,
        parseFloat(document.getElementById('by').value) || 0,
        parseFloat(document.getElementById('bz').value) || 0
    ];

    // Call Backend
    fetch('/api/calculate_vectors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ v1: v1, v2: v2 })
    })
        .then(response => response.json())
        .then(data => {
            renderPlot(data);
            renderMathOutput(data);
        })
        .catch(error => console.error('Error:', error));
}

function renderPlot(data) {
    const v1 = data.v1.components;
    const v2 = data.v2.components;

    // Origin
    const o = [0, 0, 0];

    const traces = [];

    // Vector A
    traces.push({
        type: 'scatter3d',
        mode: 'lines+markers',
        x: [o[0], v1[0]],
        y: [o[1], v1[1]],
        z: [o[2], v1[2]],
        line: { color: '#3b82f6', width: 6 },
        marker: { size: 4, color: '#3b82f6' },
        name: 'Vector A'
    });

    // Vector B
    traces.push({
        type: 'scatter3d',
        mode: 'lines+markers',
        x: [o[0], v2[0]],
        y: [o[1], v2[1]],
        z: [o[2], v2[2]],
        line: { color: '#8b5cf6', width: 6 },
        marker: { size: 4, color: '#8b5cf6' },
        name: 'Vector B'
    });

    // Projection (if exists)
    if (data.interactions && data.interactions.projection_v1_on_v2) {
        const p = data.interactions.projection_v1_on_v2;
        traces.push({
            type: 'scatter3d',
            mode: 'lines',
            x: [o[0], p[0]],
            y: [o[1], p[1]],
            z: [o[2], p[2]],
            line: { color: '#06b6d4', width: 4, dash: 'dash' },
            name: 'Proj A on B'
        });

        // Line connecting A to Projection (Orthogonal component)
        traces.push({
            type: 'scatter3d',
            mode: 'lines',
            x: [v1[0], p[0]],
            y: [v1[1], p[1]],
            z: [v1[2], p[2]],
            line: { color: '#94a3b8', width: 2, dash: 'dot' },
            showlegend: false
        });
    }

    // Cone markers usually need a separate 'cone' trace in Plotly 3D or just lines
    // For simplicity in scatter3d lines, we keep it as segments. 
    // Ideally use 'cone' type for arrowheads if requested, but lines are clearer for exact coords.

    const layout = {
        scene: {
            xaxis: { title: 'X', showgrid: true, gridcolor: '#334155' },
            yaxis: { title: 'Y', showgrid: true, gridcolor: '#334155' },
            zaxis: { title: 'Z', showgrid: true, gridcolor: '#334155' },
            bgcolor: 'rgba(0,0,0,0)'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#f1f5f9' },
        margin: { t: 0, b: 0, l: 0, r: 0 },
        showlegend: true,
        legend: { x: 0, y: 1 }
    };

    Plotly.newPlot('vectorPlot', traces, layout, { displayModeBar: false });
}

function renderMathOutput(data) {
    const outputDiv = document.getElementById('math-output');
    const inter = data.interactions;

    outputDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div>
                <h4>Vector Properties</h4>
                <p>|A| = ${data.v1.magnitude.toFixed(2)}</p>
                <p>|B| = ${data.v2.magnitude.toFixed(2)}</p>
                <p>A + B = [${data.addition.map(x => x.toFixed(1)).join(', ')}]</p>
            </div>
            <div>
                <h4>Interaction</h4>
                <p>Dot Product (A · B): <strong>${inter.dot_product.toFixed(2)}</strong></p>
                <p>Angle: <strong>${inter.angle_degrees}°</strong></p>
                <p>Projection (Yellow dashed): [${inter.projection_v1_on_v2.map(x => x.toFixed(2)).join(', ')}]</p>
            </div>
        </div>
    `;
}

// Init on load
document.addEventListener('DOMContentLoaded', updateVectors);
