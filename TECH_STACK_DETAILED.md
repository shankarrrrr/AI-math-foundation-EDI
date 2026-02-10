# 🛠️ Complete Tech Stack & Architecture Guide

## Overview

This document provides a comprehensive breakdown of every technology used in the AI Math Foundations platform, explaining how each component works together to create an interactive learning experience.

---

## 📚 Table of Contents

1. [Backend Stack](#backend-stack)
2. [Frontend Stack](#frontend-stack)
3. [Feature-by-Feature Breakdown](#feature-by-feature-breakdown)
4. [Data Flow Architecture](#data-flow-architecture)
5. [Technology Matrix](#technology-matrix)
6. [Why This Stack](#why-this-stack)

---

## Backend Stack

### Core Framework: Flask 3.0.0
**Purpose:** Web application framework  
**Responsibilities:**
- HTTP request/response handling
- URL routing (`@app.route()`)
- Template rendering (Jinja2)
- JSON API endpoints
- Session management

**Used in:** All modules - serves as the backbone

**Example:**
```python
@app.route('/api/gradient_descent', methods=['POST'])
def api_gradient_descent():
    data = request.json
    result = gradient_descent(data['start_x'], data['learning_rate'])
    return jsonify(result)
```

---

### Mathematical Computing

#### NumPy 1.24.3
**Purpose:** Numerical computing and linear algebra  
**Key Functions:**
- `np.linalg.norm()` - Vector magnitude
- `np.dot()` - Dot product, matrix multiplication
- `np.linalg.inv()` - Matrix inverse
- `np.linalg.det()` - Determinant
- `np.linalg.eig()` - Eigenvalues/eigenvectors
- `np.linspace()` - Generate evenly spaced numbers
- `np.meshgrid()` - Create coordinate matrices

**Used in:** ALL 11 modules

**Example:**
```python
# Vector magnitude
magnitude = np.linalg.norm(vector)

# Matrix multiplication
result = np.dot(matrix1, matrix2)
```

---

#### SciPy 1.15.3
**Purpose:** Scientific computing  
**Key Functions:**
- `scipy.ndimage.convolve()` - Image convolution

**Used in:** Convolution Filters module

**Example:**
```python
from scipy.ndimage import convolve
filtered_image = convolve(image, kernel, mode='constant')
```

---

### Machine Learning

#### scikit-learn 1.8.0
**Purpose:** Machine learning algorithms  
**Key Components:**

**PCA (Principal Component Analysis):**
```python
from sklearn.decomposition import PCA
pca = PCA(n_components=2)
reduced_data = pca.fit_transform(data)
```

**Classification:**
```python
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC

model = LogisticRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
```

**Regression:**
```python
from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X, y)
```

**Utilities:**
```python
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, mean_squared_error, r2_score
```

**Used in:** PCA, Feature Space, ML Model Trainer

---

### Data Processing

#### Pandas 2.1.3
**Purpose:** Data manipulation  
**Used for:** Future CSV upload functionality

#### Pillow 12.1.0
**Purpose:** Image processing  
**Used in:** Convolution Filters (image generation)

---

### Production & Deployment

#### Gunicorn 21.2.0
**Purpose:** Production WSGI server  
**Usage:**
```bash
gunicorn app:app
```

#### pyngrok 7.0.1
**Purpose:** Create public URLs for demos  
**Auto-configured** in app.py

---

## Frontend Stack

### Visualization Libraries

#### Plotly.js 2.27.0
**Purpose:** Interactive scientific visualizations  
**Capabilities:**
- 3D scatter plots
- 3D surface plots
- 2D line/scatter plots
- Contour plots
- Interactive controls (zoom, pan, rotate)

**Used in:** 9 out of 11 modules

**Example:**
```javascript
const trace = {
    x: [1, 2, 3],
    y: [2, 4, 6],
    type: 'scatter',
    mode: 'lines+markers'
};

Plotly.newPlot('plotDiv', [trace], layout);
```

---

#### Chart.js 4.4.0
**Purpose:** 2D chart rendering  
**Used for:**
- Loss curves (line charts)
- Variance explained (bar charts)
- Dual-axis charts

**Used in:** ML Model Trainer, PCA

**Example:**
```javascript
new Chart(ctx, {
    type: 'line',
    data: {
        labels: iterations,
        datasets: [{
            label: 'Loss',
            data: lossValues
        }]
    }
});
```

---

#### Canvas API (HTML5)
**Purpose:** Pixel-level image manipulation  
**Used in:** Convolution Filters

**Example:**
```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(width, height);
// Manipulate pixels
ctx.putImageData(imageData, 0, 0);
```

---

#### SVG (Scalable Vector Graphics)
**Purpose:** Vector graphics for network diagrams  
**Used in:** Neural Network Visualizer

**Example:**
```javascript
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
circle.setAttribute('cx', x);
circle.setAttribute('cy', y);
circle.setAttribute('r', radius);
svg.appendChild(circle);
```

---

### UI Technologies

#### HTML5
- Semantic markup
- Form elements
- Canvas element

#### CSS3
- **CSS Grid** - Layout system
- **Flexbox** - Component alignment
- **CSS Variables** - Theme management
- **Animations** - Transitions and keyframes
- **Glass-morphism** - Modern aesthetic

**Example:**
```css
.glass-card {
    background: rgba(30, 41, 59, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(148, 163, 184, 0.1);
}
```

#### JavaScript (ES6+)
- **Fetch API** - HTTP requests
- **Promises/Async-Await** - Asynchronous operations
- **Arrow Functions** - Concise syntax
- **Template Literals** - Dynamic HTML
- **Destructuring** - Clean data extraction

---

## Feature-by-Feature Breakdown

### Module 1: Vector Spaces

**Backend Tech:**
- NumPy for calculations
- Flask route: `/api/calculate_vectors`

**Frontend Tech:**
- Plotly.js `scatter3d` for 3D visualization
- JavaScript event handlers

**Data Flow:**
```
User Input → JavaScript → Fetch API → Flask → 
NumPy (dot product, magnitude) → JSON → 
JavaScript → Plotly.js → 3D Visualization
```

**Key Algorithms:**
```python
# Magnitude
magnitude = np.linalg.norm(vector)

# Dot product
dot_product = np.dot(v1, v2)

# Angle
cos_theta = dot_product / (mag_v1 * mag_v2)
angle = np.arccos(cos_theta)
```

---

### Module 2: Matrix Operations

**Backend Tech:**
- NumPy linear algebra functions
- Flask route: `/api/calculate_matrices`

**Frontend Tech:**
- JavaScript DOM manipulation
- CSS Grid for matrix display

**Key Operations:**
```python
# Determinant
det = np.linalg.det(matrix)

# Inverse
inv = np.linalg.inv(matrix)

# Multiplication
result = np.dot(m1, m2)
```

---

### Module 3: Linear Transformations

**Backend Tech:**
- NumPy matrix multiplication
- Shape generation algorithms

**Frontend Tech:**
- Plotly.js 2D scatter plots
- Fill visualization

**Transformation:**
```python
# Apply transformation
transformed = np.dot(transformation_matrix, points)
```

---

### Module 4: Systems of Equations

**Backend Tech:**
- Custom Gaussian elimination
- NumPy row operations

**Frontend Tech:**
- Plotly.js for 2D lines / 3D planes
- Step-by-step display

**Algorithm:**
```python
# Gaussian Elimination
for i in range(rows):
    # Pivot
    # Normalize
    # Eliminate
```

---

### Module 5: Eigenvalues & Eigenvectors

**Backend Tech:**
- NumPy eigendecomposition
- Complex number handling

**Frontend Tech:**
- Plotly.js circle transformation
- Eigenvector arrows

**Calculation:**
```python
eigenvalues, eigenvectors = np.linalg.eig(matrix)
```

---

### Module 6: Gradient Descent

**Backend Tech:**
- NumPy for gradient calculation
- Custom optimization loop

**Frontend Tech:**
- Plotly.js animated path
- JavaScript `setInterval()` for animation

**Algorithm:**
```python
for step in range(iterations):
    gradient = compute_gradient(x)
    x = x - learning_rate * gradient
```

---

### Module 7: Neural Network Visualizer

**Backend Tech:**
- NumPy matrix multiplication
- Activation functions (ReLU, Sigmoid, Tanh)

**Frontend Tech:**
- SVG for network diagram
- JavaScript DOM manipulation

**Forward Pass:**
```python
# Layer 1
z1 = np.dot(input, W1) + b1
a1 = activation(z1)

# Layer 2
z2 = np.dot(a1, W2) + b2
output = z2
```

---

### Module 8: PCA

**Backend Tech:**
- scikit-learn PCA
- StandardScaler for normalization

**Frontend Tech:**
- Plotly.js 3D scatter
- Chart.js for variance charts

**Process:**
```python
# Standardize
scaler = StandardScaler()
data_scaled = scaler.fit_transform(data)

# PCA
pca = PCA(n_components=2)
reduced = pca.fit_transform(data_scaled)
```

---

### Module 9: Feature Space & Classification

**Backend Tech:**
- scikit-learn classifiers
- NumPy meshgrid for boundaries

**Frontend Tech:**
- Plotly.js contour plots
- Scatter plots for data points

**Classification:**
```python
# Train
model = LogisticRegression()
model.fit(X, y)

# Decision boundary
Z = model.predict(meshgrid)
```

---

### Module 10: Convolution Filters

**Backend Tech:**
- SciPy convolution
- NumPy image arrays

**Frontend Tech:**
- Canvas API for rendering
- Pixel manipulation

**Convolution:**
```python
filtered = scipy.ndimage.convolve(image, kernel)
```

---

### Module 11: ML Model Trainer

**Backend Tech:**
- scikit-learn LinearRegression
- Custom gradient descent

**Frontend Tech:**
- Plotly.js scatter + line
- Chart.js loss curve

**Training:**
```python
model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
```

---

## Data Flow Architecture

### Complete Request-Response Cycle

```
┌──────────────────────────────────────────────────┐
│                    BROWSER                        │
│  User interacts with UI (inputs, buttons)        │
└────────────────────┬─────────────────────────────┘
                     │
                     ↓
┌──────────────────────────────────────────────────┐
│              JAVASCRIPT (Frontend)                │
│  - Collect user input                            │
│  - Validate data                                 │
│  - Prepare JSON payload                          │
└────────────────────┬─────────────────────────────┘
                     │
                     ↓ Fetch API (POST)
┌──────────────────────────────────────────────────┐
│              FLASK ROUTE (app.py)                │
│  @app.route('/api/endpoint', methods=['POST'])   │
│  - Parse JSON request                            │
│  - Extract parameters                            │
└────────────────────┬─────────────────────────────┘
                     │
                     ↓ Function call
┌──────────────────────────────────────────────────┐
│           MATH ENGINE (Backend Logic)            │
│  - NumPy computations                            │
│  - scikit-learn algorithms                       │
│  - SciPy operations                              │
│  - Return results as dict                        │
└────────────────────┬─────────────────────────────┘
                     │
                     ↓ jsonify()
┌──────────────────────────────────────────────────┐
│              JSON RESPONSE                        │
│  {                                               │
│    "result": [...],                              │
│    "metadata": {...}                             │
│  }                                               │
└────────────────────┬─────────────────────────────┘
                     │
                     ↓ .then(response => response.json())
┌──────────────────────────────────────────────────┐
│         JAVASCRIPT (Process Response)            │
│  - Parse JSON data                               │
│  - Format for visualization                      │
└────────────────────┬─────────────────────────────┘
                     │
                     ↓
┌──────────────────────────────────────────────────┐
│         VISUALIZATION LIBRARY                     │
│  - Plotly.js / Chart.js / Canvas / SVG          │
│  - Render interactive visualization              │
└────────────────────┬─────────────────────────────┘
                     │
                     ↓
┌──────────────────────────────────────────────────┐
│              USER SEES RESULT                     │
│  Interactive visualization with controls         │
└──────────────────────────────────────────────────┘
```

---

## Technology Matrix

| Module | Backend | ML Library | Frontend Viz | Special Tech |
|--------|---------|------------|--------------|--------------|
| Vectors | NumPy | - | Plotly 3D | - |
| Matrices | NumPy | - | CSS Grid | - |
| Transformations | NumPy | - | Plotly 2D | - |
| Systems | NumPy | - | Plotly 2D/3D | Gaussian Elim |
| Eigenvalues | NumPy | - | Plotly 2D | Complex numbers |
| Gradient Descent | NumPy | - | Plotly 2D | Animation |
| Neural Network | NumPy | - | SVG | Forward pass |
| PCA | NumPy | scikit-learn | Plotly 3D + Chart.js | StandardScaler |
| Feature Space | NumPy | scikit-learn | Plotly Contour | Classifiers |
| Convolution | NumPy | SciPy | Canvas API | Image processing |
| ML Trainer | NumPy | scikit-learn | Plotly + Chart.js | Regression |

---

## Why This Tech Stack?

### Backend Rationale

**Flask:**
- ✅ Lightweight and flexible
- ✅ Python-native (matches ML ecosystem)
- ✅ Easy to learn and extend
- ✅ Perfect for educational projects

**NumPy:**
- ✅ Industry standard for numerical computing
- ✅ Optimized C/Fortran backend (fast)
- ✅ Broadcasting for efficient operations
- ✅ Foundation for all scientific Python

**scikit-learn:**
- ✅ Production-ready ML algorithms
- ✅ Consistent API design
- ✅ Well-documented
- ✅ No deep learning complexity

**SciPy:**
- ✅ Specialized scientific functions
- ✅ Efficient convolution implementation
- ✅ Complements NumPy

### Frontend Rationale

**Plotly.js:**
- ✅ Best-in-class 3D visualization
- ✅ Interactive by default
- ✅ Scientific plotting focus
- ✅ No WebGL complexity

**Chart.js:**
- ✅ Simple and performant
- ✅ Beautiful default styling
- ✅ Perfect for 2D charts
- ✅ Lightweight (11KB)

**Vanilla JavaScript:**
- ✅ No framework overhead
- ✅ Full control
- ✅ Easier to understand
- ✅ No build process needed

**Canvas/SVG:**
- ✅ Native browser APIs
- ✅ No dependencies
- ✅ Maximum performance
- ✅ Pixel-perfect control

---

## Performance Considerations

### Backend Optimization
- NumPy vectorization (avoid loops)
- Efficient algorithms (O(n²) for Gaussian elimination)
- JSON serialization optimization

### Frontend Optimization
- Lazy loading of visualizations
- Debouncing user inputs
- CDN for external libraries
- Minimal DOM manipulation

---

## Security Measures

- Input validation (server-side)
- Error handling (try-catch blocks)
- No SQL injection risk (no database)
- CORS configuration
- HTTPS in production

---

**This tech stack provides the perfect balance of:**
- 🎯 Educational clarity
- ⚡ Performance
- 🔧 Maintainability
- 📈 Scalability
- 💼 Industry relevance
