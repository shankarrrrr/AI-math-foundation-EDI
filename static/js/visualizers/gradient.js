// Update learning rate display
document.getElementById('learningRate').addEventListener('input', function() {
    document.getElementById('lrValue').textContent = this.value;
});

let currentData = null;

function runGradientDescent() {
    const startX = parseFloat(document.getElementById('startX').value);
    const learningRate = parseFloat(document.getElementById('learningRate').value);
    const steps = parseInt(document.getElementById('steps').value);
    const functionType = document.getElementById('functionType').value;

    fetch('/api/gradient_descent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            start_x: startX,
            learning_rate: learningRate,
            steps: steps,
            function_type: functionType
        })
    })
    .then(res => res.json())
    .then(data => {
        currentData = data;
        plotGradientDescent(data, false);
        updateResults(data);
    })
    .catch(err => console.error(err));
}

function plotGradientDescent(data, animate = false) {
    const curve = data.curve;
    const history = data.history;

    // Function curve
    const curveTrace = {
        x: curve.x,
        y: curve.y,
        mode: 'lines',
        name: 'Function',
        line: { color: '#94a3b8', width: 2 }
    };

    // Path taken by gradient descent
    const pathX = history.map(h => h.x);
    const pathY = history.map(h => h.y);

    const pathTrace = {
        x: pathX,
        y: pathY,
        mode: 'lines+markers',
        name: 'Gradient Descent Path',
        line: { color: '#3b82f6', width: 3 },
        marker: { size: 6, color: '#3b82f6' }
    };

    // Starting point
    const startTrace = {
        x: [history[0].x],
        y: [history[0].y],
        mode: 'markers',
        name: 'Start',
        marker: { size: 12, color: '#22c55e', symbol: 'star' }
    };

    // Ending point
    const endTrace = {
        x: [history[history.length - 1].x],
        y: [history[history.length - 1].y],
        mode: 'markers',
        name: 'End',
        marker: { size: 12, color: '#ef4444', symbol: 'star' }
    };

    const layout = {
        title: 'Gradient Descent Optimization',
        xaxis: { title: 'x', gridcolor: '#334155' },
        yaxis: { title: 'f(x)', gridcolor: '#334155' },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#f1f5f9' },
        showlegend: true,
        hovermode: 'closest'
    };

    Plotly.newPlot('gradientPlot', [curveTrace, pathTrace, startTrace, endTrace], layout);
}

function animateGradientDescent() {
    if (!currentData) {
        runGradientDescent();
        return;
    }

    const curve = currentData.curve;
    const history = currentData.history;

    // Function curve
    const curveTrace = {
        x: curve.x,
        y: curve.y,
        mode: 'lines',
        name: 'Function',
        line: { color: '#94a3b8', width: 2 }
    };

    // Animated point
    const pointTrace = {
        x: [history[0].x],
        y: [history[0].y],
        mode: 'markers',
        name: 'Current Position',
        marker: { size: 15, color: '#facc15' }
    };

    // Path so far
    const pathTrace = {
        x: [history[0].x],
        y: [history[0].y],
        mode: 'lines',
        name: 'Path',
        line: { color: '#3b82f6', width: 3 }
    };

    const layout = {
        title: 'Gradient Descent Animation',
        xaxis: { title: 'x', gridcolor: '#334155' },
        yaxis: { title: 'f(x)', gridcolor: '#334155' },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#f1f5f9' },
        showlegend: true
    };

    Plotly.newPlot('gradientPlot', [curveTrace, pathTrace, pointTrace], layout);

    // Animate through history
    let i = 0;
    const interval = setInterval(() => {
        i++;
        if (i >= history.length) {
            clearInterval(interval);
            return;
        }

        const pathX = history.slice(0, i + 1).map(h => h.x);
        const pathY = history.slice(0, i + 1).map(h => h.y);

        Plotly.update('gradientPlot', {
            x: [[curve.x], pathX, [history[i].x]],
            y: [[curve.y], pathY, [history[i].y]]
        }, {}, [0, 1, 2]);
    }, 100);
}

function updateResults(data) {
    document.getElementById('finalX').textContent = data.final_x.toFixed(4);
    document.getElementById('finalY').textContent = data.final_y.toFixed(4);
    document.getElementById('iterations').textContent = data.iterations;
    
    let statusText = data.message;
    let statusColor = data.converged ? '#22c55e' : (data.diverged ? '#ef4444' : '#facc15');
    
    const statusEl = document.getElementById('status');
    statusEl.textContent = statusText;
    statusEl.style.color = statusColor;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    runGradientDescent();
});
