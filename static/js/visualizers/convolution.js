function applyFilter() {
    const imageType = document.getElementById('imageType').value;
    const kernelType = document.getElementById('kernelType').value;

    fetch('/api/apply_filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            image_type: imageType,
            kernel_type: kernelType
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
            return;
        }
        displayImages(data);
        displayKernel(data.kernel);
    })
    .catch(err => console.error(err));
}

function displayImages(data) {
    const originalCanvas = document.getElementById('originalCanvas');
    const filteredCanvas = document.getElementById('filteredCanvas');
    
    const originalCtx = originalCanvas.getContext('2d');
    const filteredCtx = filteredCanvas.getContext('2d');
    
    // Draw original image
    drawImageData(originalCtx, data.original, originalCanvas.width, originalCanvas.height);
    
    // Draw filtered image
    drawImageData(filteredCtx, data.filtered, filteredCanvas.width, filteredCanvas.height);
}

function drawImageData(ctx, imageData, width, height) {
    const imgArray = imageData;
    const imgHeight = imgArray.length;
    const imgWidth = imgArray[0].length;
    
    // Create ImageData
    const imageDataObj = ctx.createImageData(width, height);
    const data = imageDataObj.data;
    
    // Scale image to canvas size
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const srcY = Math.floor(y * imgHeight / height);
            const srcX = Math.floor(x * imgWidth / width);
            
            const value = Math.max(0, Math.min(255, imgArray[srcY][srcX]));
            const idx = (y * width + x) * 4;
            
            data[idx] = value;     // R
            data[idx + 1] = value; // G
            data[idx + 2] = value; // B
            data[idx + 3] = 255;   // A
        }
    }
    
    ctx.putImageData(imageDataObj, 0, 0);
}

function displayKernel(kernel) {
    const container = document.getElementById('kernelDisplay');
    container.innerHTML = '';
    
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(3, 60px)';
    grid.style.gap = '5px';
    
    kernel.forEach(row => {
        row.forEach(val => {
            const cell = document.createElement('div');
            cell.style.padding = '10px';
            cell.style.background = 'rgba(59, 130, 246, 0.2)';
            cell.style.border = '1px solid var(--primary)';
            cell.style.borderRadius = '4px';
            cell.style.textAlign = 'center';
            cell.style.fontFamily = 'monospace';
            cell.style.fontWeight = 'bold';
            cell.textContent = val.toFixed(2);
            grid.appendChild(cell);
        });
    });
    
    container.appendChild(grid);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    applyFilter();
});
