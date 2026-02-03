import numpy as np

def generate_shape(shape_type='square'):
    """Generates coordinates for different shapes."""
    if shape_type == 'square':
        # Unit square with diagonals
        return np.array([
            [0, 1, 1, 0, 0, 1, 0, 1],
            [0, 0, 1, 1, 0, 1, 1, 0]
        ])
    elif shape_type == 'triangle':
        return np.array([
            [0, 1, 0.5, 0],
            [0, 0, 1, 0]
        ])
    elif shape_type == 'grid':
        # Generate a grid of points
        x = np.linspace(-2, 2, 9)
        y = np.linspace(-2, 2, 9)
        X, Y = np.meshgrid(x, y)
        return np.array([X.flatten(), Y.flatten()])
    return np.zeros((2, 1))

def apply_transform(matrix_list, shape_type='square'):
    """
    Applies a 2x2 matrix to the shape.
    """
    try:
        matrix = np.array(matrix_list, dtype=float)
        points = generate_shape(shape_type)
        
        # Apply transformation: M * P
        transformed_points = np.dot(matrix, points)
        
        return {
            "original": points.tolist(),
            "transformed": transformed_points.tolist()
        }
    except Exception as e:
        return {"error": str(e)}
