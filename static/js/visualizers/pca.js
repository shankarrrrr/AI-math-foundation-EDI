function performPCA() {
    const dataType = document.getElementById('dataType').value;
    const nPoints = parseInt(document.getElementById('nPoints').value);
    const nComponents = parseInt(document.getElementById('nComponents').value);

    fetch('/api/pca_analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            data_type: dataType,
            n_points: nPoints,
            n_components: nComponents
        })
    })
    .then(res => res.json())
    .then(data => {
        plotPCA(data);
        plotVariance(data);
        displayResults(data);
    })
    .catch(err => console.error(err));
}

function plotPCA(data) {
    const original = data.standardized_data;
    const components = data.scaled_components;
    const mean = data.mean;

    const is3D = original[0].length === 3;

    if (is3D) {
        // 3D plot
        const scatterTrace = {
            x: original.map(p => p[0]),
            y: original.map(p => p[1]),
            z: original.map(p => p[2]),
            mode: 'markers',
            type: 'scatter3d',
            name: 'Data Points',
            marker: { size: 3, color: '#3b82f6', opacity: 0.6 }
        };

        // Principal components as arrows
        const traces = [scatterTrace];

        components.forEach((comp, idx) => {
            traces.push({
                x: [mean[0], mean[0] + comp[0] * 2],
                y: [mean[1], mean[1] + comp[1] * 2],
                z: [mean[2], mean[2] + comp[2] * 2],
                mode: 'lines+markers',
                type: 'scatter3d',
                name: `PC${idx + 1}`,
                line: { width: 6, color: idx === 0 ? '#facc15' : '#f472b6' },
                marker: { size: 6 }
            });
        });

        const layout = {
            title: 'PCA - Original Data with Principal Components',
            scene: {
                xaxis: { title: 'X', gridcolor: '#334155' },
                yaxis: { title: 'Y', gridcolor: '#334155' },
                zaxis: { title: 'Z', gridcolor: '#334155' },
                bgcolor: 'rgba(0,0,0,0)'
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#f1f5f9' },
            showlegend: true
        };

        Plotly.newPlot('pcaPlot', traces, layout);
    } else {
        // 2D plot
        const scatterTrace = {
            x: original.map(p => p[0]),
            y: original.map(p => p[1]),
            mode: 'markers',
            name: 'Data Points',
            marker: { size: 6, color: '#3b82f6', opacity: 0.6 }
        };

        const traces = [scatterTrace];

        // Principal components
        components.forEach((comp, idx) => {
            traces.push({
                x: [mean[0] - comp[0] * 2, mean[0] + comp[0] * 2],
                y: [mean[1] - comp[1] * 2, mean[1] + comp[1] * 2],
                mode: 'lines',
                name: `PC${idx + 1}`,
                line: { width: 4, color: idx === 0 ? '#facc15' : '#f472b6' }
            });
        });

        const layout = {
            title: 'PCA - Original Data with Principal Components',
            xaxis: { title: 'Feature 1', gridcolor: '#334155', zeroline: true },
            yaxis: { title: 'Feature 2', gridcolor: '#334155', zeroline: true, scaleanchor: 'x' },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#f1f5f9' },
            showlegend: true
        };

        Plotly.newPlot('pcaPlot', traces, layout);
    }
}

function plotVariance(data) {
    const variance = data.explained_variance_ratio;
    const cumulative = data.cumulative_variance;

    const barTrace = {
        x: variance.map((_, i) => `PC${i + 1}`),
        y: variance.map(v => v * 100),
        type: 'bar',
        name: 'Variance Explained',
        marker: { color: '#3b82f6' }
    };

    const lineTrace = {
        x: cumulative.map((_, i) => `PC${i + 1}`),
        y: cumulative.map(v => v * 100),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Cumulative',
        yaxis: 'y2',
        line: { color: '#facc15', width: 3 },
        marker: { size: 8 }
    };

    const layout = {
        title: 'Variance Explained by Principal Components',
        xaxis: { title: 'Principal Component' },
        yaxis: { title: 'Variance Explained (%)', gridcolor: '#334155' },
        yaxis2: {
            title: 'Cumulative Variance (%)',
            overlaying: 'y',
            side: 'right',
            gridcolor: '#334155'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#f1f5f9' },
        showlegend: true
    };

    Plotly.newPlot('variancePlot', [barTrace, lineTrace], layout);
}

function displayResults(data) {
    const container = document.getElementById('pcaResults');
    
    const varianceText = data.explained_variance_ratio
        .map((v, i) => `PC${i + 1}: ${(v * 100).toFixed(1)}%`)
        .join(', ');
    
    const html = `
        <div style="display: grid; gap: 1rem;">
            <div style="padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 8px;">
                <strong>Variance Explained:</strong> ${varianceText}
            </div>
            <div style="padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 8px;">
                <strong>Total Variance Captured:</strong> ${(data.cumulative_variance[data.cumulative_variance.length - 1] * 100).toFixed(1)}%
            </div>
            <div style="padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 8px;">
                <strong>Dimensionality Reduction:</strong> ${data.original_shape[1]} dimensions → ${data.n_components} dimensions
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    performPCA();
});
