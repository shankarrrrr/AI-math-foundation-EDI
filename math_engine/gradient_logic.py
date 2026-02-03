import numpy as np

def gradient_descent(start_x, learning_rate, steps, function_type='quadratic'):
    """
    Performs gradient descent on a specified function.
    
    Args:
        start_x: Starting x position
        learning_rate: Step size for gradient descent
        steps: Number of iterations
        function_type: Type of function ('quadratic', 'complex', 'ravine')
    
    Returns:
        Dictionary with history, convergence info, and final position
    """
    x = start_x
    history = []
    
    # Define function and its gradient
    if function_type == 'quadratic':
        # f(x) = (x - 3)^2
        func = lambda x: (x - 3) ** 2
        grad_func = lambda x: 2 * (x - 3)
        x_range = [-2, 8]
        
    elif function_type == 'complex':
        # f(x) = x^4 - 3x^3 + 2
        func = lambda x: x**4 - 3*x**3 + 2
        grad_func = lambda x: 4*x**3 - 9*x**2
        x_range = [-1, 4]
        
    elif function_type == 'ravine':
        # f(x) = x^2 + 0.1*sin(10*x)
        func = lambda x: x**2 + 0.1*np.sin(10*x)
        grad_func = lambda x: 2*x + np.cos(10*x)
        x_range = [-3, 3]
    
    else:
        func = lambda x: (x - 3) ** 2
        grad_func = lambda x: 2 * (x - 3)
        x_range = [-2, 8]
    
    # Perform gradient descent
    for i in range(steps):
        y = func(x)
        gradient = grad_func(x)
        
        history.append({
            'iteration': i,
            'x': float(x),
            'y': float(y),
            'gradient': float(gradient)
        })
        
        # Update x
        x = x - learning_rate * gradient
        
        # Check for divergence
        if abs(x) > 1000:
            return {
                'history': history,
                'converged': False,
                'diverged': True,
                'final_x': float(x),
                'final_y': float(func(x)),
                'iterations': i + 1,
                'message': 'Diverged! Learning rate too high.'
            }
    
    # Check convergence (gradient close to 0)
    final_gradient = grad_func(x)
    converged = abs(final_gradient) < 0.01
    
    # Generate function curve for plotting
    x_curve = np.linspace(x_range[0], x_range[1], 200)
    y_curve = [func(xi) for xi in x_curve]
    
    return {
        'history': history,
        'converged': converged,
        'diverged': False,
        'final_x': float(x),
        'final_y': float(func(x)),
        'final_gradient': float(final_gradient),
        'iterations': steps,
        'curve': {
            'x': x_curve.tolist(),
            'y': y_curve
        },
        'message': 'Converged!' if converged else 'More iterations needed.'
    }


def compare_learning_rates(start_x, learning_rates, steps, function_type='quadratic'):
    """
    Compare gradient descent with different learning rates.
    
    Returns:
        Dictionary with results for each learning rate
    """
    results = {}
    
    for lr in learning_rates:
        result = gradient_descent(start_x, lr, steps, function_type)
        results[f'lr_{lr}'] = result
    
    return results
