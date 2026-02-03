function createSystemInputs() {
    const size = parseInt(document.getElementById('sysSize').value);
    const container = document.getElementById('systemInputs');
    container.innerHTML = '';

    for (let i = 0; i < size; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.style.display = 'flex';
        rowDiv.style.alignItems = 'center';
        rowDiv.style.marginBottom = '0.5rem';
        rowDiv.style.gap = '0.5rem';

        for (let j = 0; j < size; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'input-field';
            input.style.width = '60px';
            input.id = `a_${i}_${j}`;
            input.placeholder = `x${j + 1}`;
            rowDiv.appendChild(input);

            if (j < size - 1) {
                const span = document.createElement('span');
                span.textContent = '+';
                rowDiv.appendChild(span);
            }
        }

        const eq = document.createElement('span');
        eq.textContent = '=';
        rowDiv.appendChild(eq);

        const bInput = document.createElement('input');
        bInput.type = 'number';
        bInput.className = 'input-field';
        bInput.style.width = '60px';
        bInput.id = `b_${i}`;
        bInput.style.borderColor = 'var(--secondary)';
        rowDiv.appendChild(bInput);

        container.appendChild(rowDiv);
    }

    // Set minimal default values for testing
    if (size === 2) {
        document.getElementById('a_0_0').value = 1; document.getElementById('a_0_1').value = 1; document.getElementById('b_0').value = 5;
        document.getElementById('a_1_0').value = 1; document.getElementById('a_1_1').value = -1; document.getElementById('b_1').value = 1;
    } else {
        document.getElementById('a_0_0').value = 1; document.getElementById('a_0_1').value = 2; document.getElementById('a_0_2').value = 3; document.getElementById('b_0').value = 10;
        document.getElementById('a_1_0').value = 2; document.getElementById('a_1_1').value = -1; document.getElementById('a_1_2').value = 1; document.getElementById('b_1').value = 5;
        document.getElementById('a_2_0').value = 3; document.getElementById('a_2_1').value = 1; document.getElementById('a_2_2').value = -1; document.getElementById('b_2').value = 2;
    }
}

function solveSystem() {
    const size = parseInt(document.getElementById('sysSize').value);
    const A = [];
    const b = [];

    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push(parseFloat(document.getElementById(`a_${i}_${j}`).value) || 0);
        }
        A.push(row);
        b.push(parseFloat(document.getElementById(`b_${i}`).value) || 0);
    }

    fetch('/api/solve_system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ A: A, b: b })
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                renderSteps(data.steps);
                renderSystemPlot(data, size);
            }
        });
}

function renderSteps(steps) {
    const container = document.getElementById('steps-container');
    container.innerHTML = '';

    steps.forEach((step, idx) => {
        const div = document.createElement('div');
        div.style.background = 'rgba(0,0,0,0.3)';
        div.style.padding = '0.8rem';
        div.style.borderRadius = '8px';
        div.style.borderLeft = '3px solid var(--primary)';

        div.innerHTML = `<strong>Step ${idx}: ${step.description}</strong>`;

        // Simple matrix print
        const matDiv = document.createElement('div');
        matDiv.style.fontFamily = 'monospace';
        matDiv.style.marginTop = '0.5rem';

        step.matrix.forEach(row => {
            matDiv.innerHTML += `[${row.map(n => n.toFixed(2)).join(', ')}]<br>`;
        });

        div.appendChild(matDiv);
        container.appendChild(div);
    });
}

function renderSystemPlot(data, size) {
    // We only visualize 2D and 3D
    // For 2D: Plot lines 
    // y = (b - a1*x) / a2

    const A = data.equations.A;
    const b = data.equations.b;
    const traces = [];

    if (size === 2) {
        // Range for x
        const xRange = [-10, 10];

        for (let i = 0; i < 2; i++) {
            const a1 = A[i][0];
            const a2 = A[i][1];
            const rhs = b[i];

            // If a2 is approx 0, x = rhs/a1 (Vertical line)
            // If a2 != 0, y = (rhs - a1*x)/a2

            let x, y;
            if (Math.abs(a2) < 0.001) {
                const xVal = rhs / a1;
                x = [xVal, xVal];
                y = [-10, 10];
            } else {
                x = xRange;
                y = xRange.map(val => (rhs - a1 * val) / a2);
            }

            traces.push({
                x: x,
                y: y,
                mode: 'lines',
                type: 'scatter',
                name: `Eq ${i + 1}`
            });
        }

        // Solution Point
        traces.push({
            x: [data.solution[0]],
            y: [data.solution[1]],
            mode: 'markers',
            marker: { size: 12, color: '#facc15' },
            name: 'Solution'
        });

        const layout = {
            title: 'Intersection of Lines',
            xaxis: { range: [-10, 10] },
            yaxis: { range: [-10, 10] },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: 'white' }
        };

        Plotly.newPlot('systemPlot', traces, layout);

    } else if (size === 3) {
        // For 3D planes: a1x + a2y + a3z = b => z = (b - a1x - a2y) / a3

        const x = [-5, 5]; // simple bounds
        const y = [-5, 5];

        // Creating meshgrid style surface is hard with just 4 points, plot_surface needs grid
        // We will generate a small grid
        const range = [-5, 5];
        const step = 1;
        const x_vals = [];
        const y_vals = [];
        for (let v = range[0]; v <= range[1]; v += step) { x_vals.push(v); y_vals.push(v); }

        for (let i = 0; i < 3; i++) {
            const a1 = A[i][0];
            const a2 = A[i][1];
            const a3 = A[i][2];
            const rhs = b[i];

            const z_vals = [];

            for (let ry of y_vals) {
                const z_row = [];
                for (let rx of x_vals) {
                    if (Math.abs(a3) > 0.001) {
                        z_row.push((rhs - a1 * rx - a2 * ry) / a3);
                    } else {
                        z_row.push(null); // Vertical planes are hard in simple surface plot
                    }
                }
                z_vals.push(z_row);
            }

            traces.push({
                type: 'surface',
                x: x_vals,
                y: y_vals,
                z: z_vals,
                opacity: 0.7,
                showscale: false,
                name: `Plane ${i + 1}`
            });
        }

        // Solution Point
        traces.push({
            x: [data.solution[0]],
            y: [data.solution[1]],
            z: [data.solution[2]],
            mode: 'markers',
            type: 'scatter3d',
            marker: { size: 10, color: '#facc15' },
            name: 'Solution'
        });

        const layout = {
            scene: {
                aspectmode: "cube"
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: 'white' }
        };
        Plotly.newPlot('systemPlot', traces, layout);
    }
}

document.addEventListener('DOMContentLoaded', createSystemInputs);
