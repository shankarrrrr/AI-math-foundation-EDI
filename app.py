from flask import Flask, render_template, request, jsonify
from math_engine.vector_logic import calculate_vector_properties
from math_engine.matrix_logic import matrix_operations
from math_engine.transform_logic import apply_transform
from math_engine.solver_logic import solve_system
from math_engine.eigen_logic import calculate_eigen
from math_engine.gradient_logic import gradient_descent, compare_learning_rates
from math_engine.neural_logic import forward_pass, initialize_network, visualize_network_structure
from math_engine.pca_logic import perform_pca, generate_sample_data as pca_generate_data
from math_engine.feature_logic import generate_classification_data, train_classifier
from math_engine.convolution_logic import apply_convolution, generate_sample_image, get_predefined_kernels
from math_engine.ml_model_logic import generate_sample_dataset, train_linear_regression, train_with_iterations

app = Flask(__name__)

# --- Routes ---

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/vectors')
def vectors():
    return render_template('vectors.html')

@app.route('/api/calculate_vectors', methods=['POST'])
def api_calculate_vectors():
    data = request.json
    v1 = data.get('v1', [0,0,0])
    v2 = data.get('v2', [0,0,0])
    result = calculate_vector_properties(v1, v2)
    return jsonify(result)

@app.route('/matrices')
def matrices():
    return render_template('matrices.html')

@app.route('/api/calculate_matrices', methods=['POST'])
def api_calculate_matrices():
    data = request.json
    op = data.get('operation')
    m1 = data.get('m1')
    m2 = data.get('m2')
    result = matrix_operations(op, m1, m2)
    return jsonify(result)

@app.route('/transformations')
def transformations():
    return render_template('transformations.html')

@app.route('/api/transform', methods=['POST'])
def api_transform():
    data = request.json
    matrix = data.get('matrix')
    shape = data.get('shape', 'square')
    result = apply_transform(matrix, shape)
    return jsonify(result)
    
@app.route('/systems')
def systems():
    return render_template('systems.html')

@app.route('/api/solve_system', methods=['POST'])
def api_solve_system():
    data = request.json
    A = data.get('A')
    b = data.get('b')
    result = solve_system(A, b)
    return jsonify(result)

@app.route('/eigen')
def eigen():
    return render_template('eigen.html')

@app.route('/api/calculate_eigen', methods=['POST'])
def api_calculate_eigen():
    data = request.json
    matrix = data.get('matrix')
    result = calculate_eigen(matrix)
    return jsonify(result)

# --- New AI/ML Routes ---

@app.route('/gradient')
def gradient():
    return render_template('gradient.html')

@app.route('/api/gradient_descent', methods=['POST'])
def api_gradient_descent():
    data = request.json
    start_x = data.get('start_x', 0)
    learning_rate = data.get('learning_rate', 0.1)
    steps = data.get('steps', 50)
    function_type = data.get('function_type', 'quadratic')
    result = gradient_descent(start_x, learning_rate, steps, function_type)
    return jsonify(result)

@app.route('/neural')
def neural():
    return render_template('neural.html')

@app.route('/api/neural_forward', methods=['POST'])
def api_neural_forward():
    data = request.json
    inputs = data.get('inputs', [1, 1])
    W1 = data.get('W1')
    b1 = data.get('b1')
    W2 = data.get('W2')
    b2 = data.get('b2')
    activation = data.get('activation', 'relu')
    
    if W1 is None:
        # Initialize network
        network = initialize_network()
        W1 = network['W1']
        b1 = network['b1']
        W2 = network['W2']
        b2 = network['b2']
    
    result = forward_pass(inputs, W1, b1, W2, b2, activation)
    return jsonify(result)

@app.route('/api/neural_structure', methods=['GET'])
def api_neural_structure():
    result = visualize_network_structure()
    return jsonify(result)

@app.route('/pca')
def pca():
    return render_template('pca.html')

@app.route('/api/pca_analyze', methods=['POST'])
def api_pca_analyze():
    data = request.json
    data_type = data.get('data_type', 'ellipse')
    n_points = data.get('n_points', 100)
    n_components = data.get('n_components', 2)
    
    # Generate or use provided data
    if 'data' in data:
        sample_data = data['data']
    else:
        sample_data = pca_generate_data(data_type, n_points)
    
    result = perform_pca(sample_data, n_components)
    return jsonify(result)

@app.route('/feature_space')
def feature_space():
    return render_template('feature_space.html')

@app.route('/api/generate_classification', methods=['POST'])
def api_generate_classification():
    data = request.json
    n_samples = data.get('n_samples', 100)
    separation = data.get('separation', 2.0)
    noise = data.get('noise', 0.5)
    pattern = data.get('pattern', 'linear')
    
    X, y = generate_classification_data(n_samples, separation, noise, pattern)
    return jsonify({'X': X.tolist(), 'y': y.tolist()})

@app.route('/api/train_classifier', methods=['POST'])
def api_train_classifier():
    data = request.json
    X = data.get('X')
    y = data.get('y')
    classifier_type = data.get('classifier_type', 'logistic')
    kernel = data.get('kernel', 'linear')
    
    result = train_classifier(X, y, classifier_type, kernel)
    return jsonify(result)

@app.route('/convolution')
def convolution():
    return render_template('convolution.html')

@app.route('/api/apply_filter', methods=['POST'])
def api_apply_filter():
    data = request.json
    kernel_type = data.get('kernel_type', 'edge_detect')
    image_type = data.get('image_type', 'checkerboard')
    
    # Generate sample image
    image = generate_sample_image(image_type)
    
    result = apply_convolution(image, kernel_type)
    return jsonify(result)

@app.route('/api/get_kernels', methods=['GET'])
def api_get_kernels():
    kernels = get_predefined_kernels()
    # Convert to serializable format
    kernels_dict = {k: v.tolist() for k, v in kernels.items()}
    return jsonify(kernels_dict)

@app.route('/ml_model')
def ml_model():
    return render_template('ml_model.html')

@app.route('/api/generate_dataset', methods=['POST'])
def api_generate_dataset():
    data = request.json
    dataset_type = data.get('dataset_type', 'linear')
    n_samples = data.get('n_samples', 100)
    noise = data.get('noise', 10)
    
    X, y = generate_sample_dataset(dataset_type, n_samples, noise)
    return jsonify({'X': X.tolist(), 'y': y.tolist()})

@app.route('/api/train_model', methods=['POST'])
def api_train_model():
    data = request.json
    X = data.get('X')
    y = data.get('y')
    
    result = train_linear_regression(X, y)
    return jsonify(result)

@app.route('/api/train_iterative', methods=['POST'])
def api_train_iterative():
    data = request.json
    X = data.get('X')
    y = data.get('y')
    n_iterations = data.get('n_iterations', 50)
    
    result = train_with_iterations(X, y, n_iterations)
    return jsonify(result)

if __name__ == '__main__':
    print("="*50)
    print("  MathAI Visualizer Server Starting...")
    print("  Access at: http://127.0.0.1:5000")
    
    # Pyngrok Integration
    try:
        from pyngrok import ngrok, conf
        import os, shutil

        # Use a local bin folder to avoid permission issues
        project_dir = os.path.dirname(os.path.abspath(__file__))
        bin_dir = os.path.join(project_dir, 'bin')
        if not os.path.exists(bin_dir):
            os.makedirs(bin_dir)
            
        # Point detailed config to this location
        ngrok_exe = os.path.join(bin_dir, 'ngrok.exe')
        conf.get_default().ngrok_path = ngrok_exe
        
        # Check if we need to install/download
        if not os.path.exists(ngrok_exe):
            print(f"  * Downloading ngrok to {ngrok_exe}...")
            # pyngrok's ensure_ngrok_installed usually handles download to the path
            # But strictly it installs to default location unless managed.
            # Let's try to let connect handle it, or force install.
            # Actually, standard behavior is if path is set in conf, it looks there.
            pass
            
        # Open a HTTP tunnel on the default port 5000
        public_url = ngrok.connect(5000).public_url
        print(f"  * Public URL: {public_url}")
    except Exception as e:
        print(f"  ! Ngrok Error: {e}")
        print("  ! Continuing with local access only.")

    print("="*50)
    app.run(host='0.0.0.0', port=5000, debug=True)
