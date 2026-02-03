let networkWeights = null;

function randomizeWeights() {
    fetch('/api/neural_forward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            inputs: [1, 1],
            activation: 'relu'
        })
    })
    .then(res => res.json())
    .then(data => {
        networkWeights = data.weights;
        alert('Weights randomized! Click "Forward Pass" to see results.');
    });
}

function runForwardPass() {
    const input1 = parseFloat(document.getElementById('input1').value);
    const input2 = parseFloat(document.getElementById('input2').value);
    const activation = document.getElementById('activation').value;

    const payload = {
        inputs: [input1, input2],
        activation: activation
    };

    if (networkWeights) {
        payload.W1 = networkWeights.W1;
        payload.b1 = networkWeights.b1;
        payload.W2 = networkWeights.W2;
        payload.b2 = networkWeights.b2;
    }

    fetch('/api/neural_forward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        networkWeights = data.weights;
        visualizeNetwork(data);
        displayComputations(data);
    })
    .catch(err => console.error(err));
}

function visualizeNetwork(data) {
    const container = document.getElementById('networkViz');
    container.innerHTML = '';

    const width = container.clientWidth || 800;
    const height = 400;

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.style.background = 'rgba(0,0,0,0.1)';
    svg.style.borderRadius = '12px';

    // Layer positions
    const layers = [
        { nodes: 2, x: width * 0.2, label: 'Input' },
        { nodes: 3, x: width * 0.5, label: 'Hidden' },
        { nodes: 1, x: width * 0.8, label: 'Output' }
    ];

    const nodeRadius = 25;
    const nodePositions = [];

    // Draw connections first (so they're behind nodes)
    layers.forEach((layer, layerIdx) => {
        const yStart = (height - (layer.nodes - 1) * 80) / 2;
        
        for (let i = 0; i < layer.nodes; i++) {
            const y = yStart + i * 80;
            nodePositions.push({ x: layer.x, y: y, layer: layerIdx, index: i });
        }
    });

    // Draw connections
    for (let i = 0; i < nodePositions.length; i++) {
        const node = nodePositions[i];
        if (node.layer < 2) {
            const nextLayerNodes = nodePositions.filter(n => n.layer === node.layer + 1);
            nextLayerNodes.forEach(nextNode => {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', node.x);
                line.setAttribute('y1', node.y);
                line.setAttribute('x2', nextNode.x);
                line.setAttribute('y2', nextNode.y);
                line.setAttribute('stroke', '#475569');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('opacity', '0.3');
                svg.appendChild(line);
            });
        }
    }

    // Draw nodes
    const inputValues = data.input;
    const hiddenValues = data.hidden_activation;
    const outputValues = data.output;

    nodePositions.forEach(node => {
        // Get activation value
        let value = 0;
        if (node.layer === 0) value = inputValues[node.index];
        else if (node.layer === 1) value = hiddenValues[node.index];
        else value = outputValues[node.index];

        // Color based on activation
        const intensity = Math.min(Math.abs(value) / 2, 1);
        const color = value >= 0 
            ? `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`
            : `rgba(239, 68, 68, ${0.3 + intensity * 0.7})`;

        // Draw circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', nodeRadius);
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', '#f1f5f9');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);

        // Draw value text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x);
        text.setAttribute('y', node.y + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#f1f5f9');
        text.setAttribute('font-size', '14');
        text.setAttribute('font-weight', 'bold');
        text.textContent = value.toFixed(2);
        svg.appendChild(text);
    });

    // Draw layer labels
    layers.forEach(layer => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', layer.x);
        text.setAttribute('y', 30);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#94a3b8');
        text.setAttribute('font-size', '16');
        text.setAttribute('font-weight', 'bold');
        text.textContent = layer.label;
        svg.appendChild(text);
    });

    container.appendChild(svg);
}

function displayComputations(data) {
    const container = document.getElementById('computations');
    
    const html = `
        <div style="display: grid; gap: 1.5rem;">
            <div style="padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 8px; border-left: 3px solid var(--primary);">
                <h4>Layer 1: Input → Hidden</h4>
                <p style="margin-top: 0.5rem; font-family: monospace;">
                    z₁ = W₁ × input + b₁<br>
                    h = ${data.activation_type}(z₁)<br>
                    <span style="color: var(--primary);">Hidden activations: [${data.hidden_activation.map(v => v.toFixed(2)).join(', ')}]</span>
                </p>
            </div>
            
            <div style="padding: 1rem; background: rgba(139, 92, 246, 0.1); border-radius: 8px; border-left: 3px solid var(--secondary);">
                <h4>Layer 2: Hidden → Output</h4>
                <p style="margin-top: 0.5rem; font-family: monospace;">
                    output = W₂ × h + b₂<br>
                    <span style="color: var(--secondary);">Final output: ${data.output[0].toFixed(4)}</span>
                </p>
            </div>
            
            <div style="padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 8px;">
                <h4>Weight Matrices</h4>
                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">
                    W₁ shape: 2×3 (connects 2 inputs to 3 hidden neurons)<br>
                    W₂ shape: 3×1 (connects 3 hidden to 1 output)<br>
                    Total parameters: ${2*3 + 3 + 3*1 + 1} (weights + biases)
                </p>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    runForwardPass();
});
