let currentData = null;

function generateAndClassify() {
    const pattern = document.getElementById('pattern').value;
    const nSamples = parseInt(document.getElementById('nSamples').value);
    const classifier = document.getElementById('classifier').value;

    // Generate data
    fetch('/api/generate_classification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            n_samples: nSamples,
            pattern: pattern,
            separation: 2.0,
            noise: 0.5
        })
    })
    .then(res => res.json())
    .then(data => {
        currentData = data;
        // Train classifier
        return fetch('/api/train_classifier', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                X: data.X,
                y: data.y,
                classifier_type: classifier
            })
        });
    })
    .then(res => res.json())
    .then(result => {
        plotFeatureSpace(result);
        displayResults(result);
    })
    .catch(err => console.error(err));
}

function plotFeatureSpace(data) {
    const X = data.X;
    const y = data.y;
    const boundary = data.decision_boundary;

    // Separate classes
    const class0X = [];
    const class0Y = [];
    const class1X = [];
    const class1Y = [];

    X.forEach((point, idx) => {
        if (y[idx] === 0) {
            class0X.push(point[0]);
            class0Y.push(point[1]);
        } else {
            class1X.push(point[0]);
            class1Y.push(point[1]);
        }
    });

    // Decision boundary contour
    const contourTrace = {
        x: boundary.xx[0],
        y: boundary.yy.map(row => row[0]),
        z: boundary.Z,
        type: 'contour',
        colorscale: [
            [0, 'rgba(239, 68, 68, 0.3)'],
            [1, 'rgba(59, 130, 246, 0.3)']
        ],
        showscale: false,
        contours: {
            start: 0,
            end: 1,
            size: 0.5
        },
        line: { width: 0 }
    };

    // Class 0 points
    const class0Trace = {
        x: class0X,
        y: class0Y,
        mode: 'markers',
        type: 'scatter',
        name: 'Class 0',
        marker: { size: 8, color: '#ef4444', symbol: 'circle', line: { width: 1, color: '#fff' } }
    };

    // Class 1 points
    const class1Trace = {
        x: class1X,
        y: class1Y,
        mode: 'markers',
        type: 'scatter',
        name: 'Class 1',
        marker: { size: 8, color: '#3b82f6', symbol: 'square', line: { width: 1, color: '#fff' } }
    };

    // Misclassified points
    const misclassifiedX = [];
    const misclassifiedY = [];
    data.misclassified_indices.forEach(idx => {
        misclassifiedX.push(X[idx][0]);
        misclassifiedY.push(X[idx][1]);
    });

    const misclassifiedTrace = {
        x: misclassifiedX,
        y: misclassifiedY,
        mode: 'markers',
        type: 'scatter',
        name: 'Misclassified',
        marker: { size: 12, color: '#facc15', symbol: 'x', line: { width: 2 } }
    };

    const layout = {
        title: 'Feature Space & Decision Boundary',
        xaxis: { title: 'Feature 1', gridcolor: '#334155' },
        yaxis: { title: 'Feature 2', gridcolor: '#334155', scaleanchor: 'x' },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#f1f5f9' },
        showlegend: true,
        hovermode: 'closest'
    };

    Plotly.newPlot('featurePlot', [contourTrace, class0Trace, class1Trace, misclassifiedTrace], layout);
}

function displayResults(data) {
    document.getElementById('accuracy').textContent = (data.accuracy * 100).toFixed(1) + '%';
    document.getElementById('misclassified').textContent = data.n_misclassified;
    document.getElementById('totalSamples').textContent = data.X.length;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    generateAndClassify();
});
