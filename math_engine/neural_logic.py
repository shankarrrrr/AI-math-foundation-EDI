import numpy as np

def initialize_network(input_size=2, hidden_size=3, output_size=1, seed=42):
    """
    Initialize a simple neural network with random weights.
    
    Returns:
        Dictionary with weight matrices
    """
    np.random.seed(seed)
    
    # Xavier initialization
    W1 = np.random.randn(input_size, hidden_size) * np.sqrt(2.0 / input_size)
    b1 = np.zeros((1, hidden_size))
    
    W2 = np.random.randn(hidden_size, output_size) * np.sqrt(2.0 / hidden_size)
    b2 = np.zeros((1, output_size))
    
    return {
        'W1': W1.tolist(),
        'b1': b1.tolist(),
        'W2': W2.tolist(),
        'b2': b2.tolist()
    }


def activation_function(x, activation_type='relu'):
    """Apply activation function."""
    if activation_type == 'relu':
        return np.maximum(0, x)
    elif activation_type == 'sigmoid':
        return 1 / (1 + np.exp(-np.clip(x, -500, 500)))
    elif activation_type == 'tanh':
        return np.tanh(x)
    else:
        return x


def forward_pass(inputs, W1, b1, W2, b2, activation='relu'):
    """
    Perform forward pass through the network.
    
    Args:
        inputs: Input vector [x1, x2]
        W1, b1: First layer weights and biases
        W2, b2: Second layer weights and biases
        activation: Activation function type
    
    Returns:
        Dictionary with layer outputs and intermediate values
    """
    # Convert inputs to numpy arrays
    inputs = np.array(inputs).reshape(1, -1)
    W1 = np.array(W1)
    b1 = np.array(b1)
    W2 = np.array(W2)
    b2 = np.array(b2)
    
    # Layer 1: Input to Hidden
    z1 = np.dot(inputs, W1) + b1
    a1 = activation_function(z1, activation)
    
    # Layer 2: Hidden to Output
    z2 = np.dot(a1, W2) + b2
    a2 = z2  # Linear output for regression
    
    return {
        'input': inputs.tolist()[0],
        'hidden_pre_activation': z1.tolist()[0],
        'hidden_activation': a1.tolist()[0],
        'output_pre_activation': z2.tolist()[0],
        'output': a2.tolist()[0],
        'weights': {
            'W1': W1.tolist(),
            'b1': b1.tolist()[0],
            'W2': W2.tolist(),
            'b2': b2.tolist()[0]
        },
        'activation_type': activation
    }


def visualize_network_structure(input_size=2, hidden_size=3, output_size=1):
    """
    Generate network structure for visualization.
    
    Returns:
        Dictionary with node positions and connections
    """
    nodes = {
        'input': [{'id': f'i{i}', 'layer': 0, 'index': i} for i in range(input_size)],
        'hidden': [{'id': f'h{i}', 'layer': 1, 'index': i} for i in range(hidden_size)],
        'output': [{'id': f'o{i}', 'layer': 2, 'index': i} for i in range(output_size)]
    }
    
    # Generate connections
    connections = []
    
    # Input to Hidden
    for i in range(input_size):
        for h in range(hidden_size):
            connections.append({
                'from': f'i{i}',
                'to': f'h{h}',
                'layer': 'input_to_hidden'
            })
    
    # Hidden to Output
    for h in range(hidden_size):
        for o in range(output_size):
            connections.append({
                'from': f'h{h}',
                'to': f'o{o}',
                'layer': 'hidden_to_output'
            })
    
    return {
        'nodes': nodes,
        'connections': connections
    }


def batch_forward_pass(input_batch, W1, b1, W2, b2, activation='relu'):
    """
    Process multiple inputs through the network.
    
    Args:
        input_batch: List of input vectors
        
    Returns:
        List of outputs
    """
    results = []
    
    for inputs in input_batch:
        result = forward_pass(inputs, W1, b1, W2, b2, activation)
        results.append(result)
    
    return results
