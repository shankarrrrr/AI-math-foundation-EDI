import numpy as np
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score
from sklearn.preprocessing import StandardScaler

def generate_sample_dataset(dataset_type='linear', n_samples=100, noise=10):
    """
    Generate sample datasets for ML training.
    
    Args:
        dataset_type: 'linear', 'quadratic', 'sine', 'classification'
        n_samples: Number of samples
        noise: Amount of noise
    
    Returns:
        X (features), y (target)
    """
    np.random.seed(42)
    
    if dataset_type == 'linear':
        X = np.linspace(0, 10, n_samples).reshape(-1, 1)
        y = 2.5 * X.ravel() + 5 + np.random.normal(0, noise, n_samples)
        
    elif dataset_type == 'quadratic':
        X = np.linspace(-5, 5, n_samples).reshape(-1, 1)
        y = 0.5 * X.ravel()**2 + 2*X.ravel() + 1 + np.random.normal(0, noise, n_samples)
        
    elif dataset_type == 'sine':
        X = np.linspace(0, 4*np.pi, n_samples).reshape(-1, 1)
        y = 10 * np.sin(X.ravel()) + np.random.normal(0, noise, n_samples)
        
    elif dataset_type == 'classification':
        # Binary classification
        X = np.random.randn(n_samples, 2)
        y = (X[:, 0] + X[:, 1] > 0).astype(int)
        return X, y
    
    else:
        X = np.linspace(0, 10, n_samples).reshape(-1, 1)
        y = 2.5 * X.ravel() + 5 + np.random.normal(0, noise, n_samples)
    
    return X, y


def train_linear_regression(X, y, test_size=0.2):
    """
    Train a linear regression model.
    
    Args:
        X: Feature matrix
        y: Target vector
        test_size: Proportion of data for testing
    
    Returns:
        Dictionary with model results and metrics
    """
    X = np.array(X)
    y = np.array(y)
    
    # Ensure X is 2D
    if len(X.shape) == 1:
        X = X.reshape(-1, 1)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=42
    )
    
    # Train model
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    # Make predictions
    y_train_pred = model.predict(X_train)
    y_test_pred = model.predict(X_test)
    
    # Calculate metrics
    train_mse = mean_squared_error(y_train, y_train_pred)
    test_mse = mean_squared_error(y_test, y_test_pred)
    train_r2 = r2_score(y_train, y_train_pred)
    test_r2 = r2_score(y_test, y_test_pred)
    
    # Generate prediction line for visualization
    if X.shape[1] == 1:
        X_line = np.linspace(X.min(), X.max(), 100).reshape(-1, 1)
        y_line = model.predict(X_line)
    else:
        X_line = None
        y_line = None
    
    return {
        'model_type': 'linear_regression',
        'coefficients': model.coef_.tolist(),
        'intercept': float(model.intercept_),
        'train_data': {
            'X': X_train.tolist(),
            'y': y_train.tolist(),
            'predictions': y_train_pred.tolist()
        },
        'test_data': {
            'X': X_test.tolist(),
            'y': y_test.tolist(),
            'predictions': y_test_pred.tolist()
        },
        'metrics': {
            'train_mse': float(train_mse),
            'test_mse': float(test_mse),
            'train_r2': float(train_r2),
            'test_r2': float(test_r2)
        },
        'prediction_line': {
            'X': X_line.tolist() if X_line is not None else None,
            'y': y_line.tolist() if y_line is not None else None
        }
    }


def train_with_iterations(X, y, n_iterations=50):
    """
    Simulate iterative training to show loss decrease.
    
    Returns:
        Dictionary with loss history
    """
    X = np.array(X)
    y = np.array(y)
    
    if len(X.shape) == 1:
        X = X.reshape(-1, 1)
    
    # Use gradient descent manually for visualization
    # Initialize parameters
    n_features = X.shape[1]
    theta = np.zeros(n_features + 1)  # +1 for intercept
    
    # Add intercept term
    X_b = np.c_[np.ones((X.shape[0], 1)), X]
    
    # Learning rate
    learning_rate = 0.01
    m = len(y)
    
    loss_history = []
    theta_history = []
    
    for iteration in range(n_iterations):
        # Predictions
        predictions = X_b.dot(theta)
        
        # Calculate loss (MSE)
        loss = np.mean((predictions - y) ** 2)
        loss_history.append(float(loss))
        theta_history.append(theta.copy().tolist())
        
        # Calculate gradients
        gradients = (2/m) * X_b.T.dot(predictions - y)
        
        # Update parameters
        theta = theta - learning_rate * gradients
    
    # Final predictions
    final_predictions = X_b.dot(theta)
    
    return {
        'loss_history': loss_history,
        'theta_history': theta_history,
        'final_theta': theta.tolist(),
        'final_predictions': final_predictions.tolist(),
        'n_iterations': n_iterations
    }
