import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

def generate_classification_data(n_samples=100, separation=2.0, noise=0.5, pattern='linear'):
    """
    Generate 2D classification data.
    
    Args:
        n_samples: Number of samples per class
        separation: Distance between class centers
        noise: Amount of noise
        pattern: 'linear', 'circular', 'moons', 'blobs'
    
    Returns:
        X (features), y (labels)
    """
    np.random.seed(42)
    
    if pattern == 'linear':
        # Linearly separable classes
        X1 = np.random.randn(n_samples, 2) * noise + np.array([separation, 0])
        X2 = np.random.randn(n_samples, 2) * noise + np.array([-separation, 0])
        
    elif pattern == 'circular':
        # Circular pattern (inner and outer)
        theta1 = np.random.uniform(0, 2*np.pi, n_samples)
        r1 = np.random.normal(1, noise*0.3, n_samples)
        X1 = np.column_stack([r1 * np.cos(theta1), r1 * np.sin(theta1)])
        
        theta2 = np.random.uniform(0, 2*np.pi, n_samples)
        r2 = np.random.normal(separation*1.5, noise*0.3, n_samples)
        X2 = np.column_stack([r2 * np.cos(theta2), r2 * np.sin(theta2)])
        
    elif pattern == 'moons':
        # Two interleaving half circles
        theta = np.linspace(0, np.pi, n_samples)
        X1 = np.column_stack([
            np.cos(theta) * separation + np.random.normal(0, noise, n_samples),
            np.sin(theta) + np.random.normal(0, noise, n_samples)
        ])
        X2 = np.column_stack([
            1 - np.cos(theta) * separation + np.random.normal(0, noise, n_samples),
            0.5 - np.sin(theta) + np.random.normal(0, noise, n_samples)
        ])
        
    elif pattern == 'blobs':
        # Random blob positions
        X1 = np.random.randn(n_samples, 2) * noise + np.array([separation, separation])
        X2 = np.random.randn(n_samples, 2) * noise + np.array([-separation, -separation])
    
    else:
        # Default to linear
        X1 = np.random.randn(n_samples, 2) * noise + np.array([separation, 0])
        X2 = np.random.randn(n_samples, 2) * noise + np.array([-separation, 0])
    
    X = np.vstack([X1, X2])
    y = np.hstack([np.zeros(n_samples), np.ones(n_samples)])
    
    return X, y


def train_classifier(X, y, classifier_type='logistic', kernel='linear'):
    """
    Train a classifier and generate decision boundary.
    
    Args:
        X: Feature matrix (n_samples, 2)
        y: Labels (n_samples,)
        classifier_type: 'logistic' or 'svm'
        kernel: For SVM - 'linear', 'rbf', 'poly'
    
    Returns:
        Dictionary with model, predictions, and decision boundary
    """
    X = np.array(X)
    y = np.array(y)
    
    # Train classifier
    if classifier_type == 'logistic':
        model = LogisticRegression()
        model.fit(X, y)
    elif classifier_type == 'svm':
        model = SVC(kernel=kernel, probability=True)
        model.fit(X, y)
    else:
        model = LogisticRegression()
        model.fit(X, y)
    
    # Make predictions
    predictions = model.predict(X)
    accuracy = accuracy_score(y, predictions)
    
    # Generate decision boundary
    x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
    y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
    
    xx, yy = np.meshgrid(
        np.linspace(x_min, x_max, 100),
        np.linspace(y_min, y_max, 100)
    )
    
    Z = model.predict(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)
    
    # Get probability/confidence if available
    try:
        Z_proba = model.predict_proba(np.c_[xx.ravel(), yy.ravel()])[:, 1]
        Z_proba = Z_proba.reshape(xx.shape)
    except:
        Z_proba = Z
    
    # Find misclassified points
    misclassified = predictions != y
    
    return {
        'X': X.tolist(),
        'y': y.tolist(),
        'predictions': predictions.tolist(),
        'accuracy': float(accuracy),
        'decision_boundary': {
            'xx': xx.tolist(),
            'yy': yy.tolist(),
            'Z': Z.tolist(),
            'Z_proba': Z_proba.tolist()
        },
        'misclassified_indices': np.where(misclassified)[0].tolist(),
        'classifier_type': classifier_type,
        'n_misclassified': int(misclassified.sum())
    }


def visualize_feature_space(X, y, feature_names=['Feature 1', 'Feature 2']):
    """
    Prepare feature space visualization data.
    
    Returns:
        Dictionary with visualization data
    """
    X = np.array(X)
    y = np.array(y)
    
    # Separate classes
    X_class0 = X[y == 0]
    X_class1 = X[y == 1]
    
    # Calculate statistics
    mean_class0 = np.mean(X_class0, axis=0)
    mean_class1 = np.mean(X_class1, axis=0)
    
    return {
        'class_0': {
            'points': X_class0.tolist(),
            'mean': mean_class0.tolist(),
            'count': len(X_class0)
        },
        'class_1': {
            'points': X_class1.tolist(),
            'mean': mean_class1.tolist(),
            'count': len(X_class1)
        },
        'feature_names': feature_names,
        'bounds': {
            'x_min': float(X[:, 0].min()),
            'x_max': float(X[:, 0].max()),
            'y_min': float(X[:, 1].min()),
            'y_max': float(X[:, 1].max())
        }
    }
