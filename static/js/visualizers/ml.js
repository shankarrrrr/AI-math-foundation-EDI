// Update noise display
document.getElementById('noise').addEventListener('input', function() {
    document.getElementById('noiseValue').textContent = this.value;
});

let currentDataset = null;

function generateDataset() {
    const datasetType = document.getElementById('datasetType').value;
    const nSamples = parseInt(document.getElementById('nSamples').value);
    const noise = parseInt(document.getElementById('noise').value);

    fetch('/api/generate_dataset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            dataset_type: datasetType,
            n_samples: nSamples,
            noise: noise
        })
    })
    .then(res => res.json())
    .then(data => {
        currentDataset = data;
        plotDataset(data);
    })
    .catch(err => console.error(err));
}

function plotDataset(data) {
    const trace = {
        x: data.X.map(row => row[0]),
        y: data.y,
        mode: 'markers',
        type: 'scatter',
        name: 'Training Data',
        marker: { size: 8, color: '#3b82f6', opacity: 0.6 }
    };

    const layout = {
        title: 'Dataset',
        xaxis: { title: 'X', gridcolor: '#334155' },
        yaxis: { title: 'y', gridcolor: '#334155' },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#f1f5f9' },
        showlegend: true
    };

    Plotly.newPlot('dataPlot', [trace], layout);
}

function trainModel() {
    if (!currentDataset) {
        generateDataset();
        setTimeout(trainModel, 500);
        return;
    }

    fetch('/api/train_model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            X: currentDataset.X,
            y: currentDataset.y
        })
    })
    .then(res => res.json())
    .then(data => {
        plotModelFit(data);
        displayMetrics(data.metrics);
    })
    .catch(err => console.error(err));
}

function trainIterative() {
    if (!currentDataset) {
        generateDataset();
        setTimeout(trainIterative, 500);
        return;
    }

    fetch('/api/train_iterative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            X: currentDataset.X,
            y: currentDataset.y,
            n_iterations: 50
        })
    })
    .then(res => res.json())
    .then(data => {
        plotLossCurve(data.loss_history);
        // Also plot final fit
        trainModel();
    })
    .catch(err => console.error(err));
}

function plotModelFit(data) {
    const trainTrace = {
        x: data.train_data.X.map(row => row[0]),
        y: data.train_data.y,
        mode: 'markers',
        name: 'Train Data',
        marker: { size: 8, color: '#3b82f6', opacity: 0.6 }
    };

    const testTrace = {
        x: data.test_data.X.map(row => row[0]),
        y: data.test_data.y,
        mode: 'markers',
        name: 'Test Data',
        marker: { size: 8, color: '#22c55e', opacity: 0.6 }
    };

    const traces = [trainTrace, testTrace];

    // Add prediction line if available
    if (data.prediction_line.X) {
        traces.push({
            x: data.prediction_line.X.map(row => row[0]),
            y: data.prediction_line.y,
            mode: 'lines',
            name: 'Model Prediction',
            line: { color: '#ef4444', width: 3 }
        });
    }

    const layout = {
        title: 'Model Fit',
        xaxis: { title: 'X', gridcolor: '#334155' },
        yaxis: { title: 'y', gridcolor: '#334155' },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#f1f5f9' },
        showlegend: true
    };

    Plotly.newPlot('dataPlot', traces, layout);
}

function plotLossCurve(lossHistory) {
    const trace = {
        x: lossHistory.map((_, i) => i),
        y: lossHistory,
        mode: 'lines',
        name: 'Training Loss',
        line: { color: '#3b82f6', width: 3 }
    };

    const layout = {
        title: 'Loss Curve (Training Progress)',
        xaxis: { title: 'Iteration', gridcolor: '#334155' },
        yaxis: { title: 'Loss (MSE)', gridcolor: '#334155' },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#f1f5f9' },
        showlegend: false
    };

    Plotly.newPlot('lossPlot', [trace], layout);
}

function displayMetrics(metrics) {
    document.getElementById('trainR2').textContent = metrics.train_r2.toFixed(4);
    document.getElementById('testR2').textContent = metrics.test_r2.toFixed(4);
    document.getElementById('trainMSE').textContent = metrics.train_mse.toFixed(2);
    document.getElementById('testMSE').textContent = metrics.test_mse.toFixed(2);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    generateDataset();
});
