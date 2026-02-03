import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

def generate_sample_data(data_type='ellipse', n_points=100, noise=0.1):
    """
    Generate sample data for PCA demonstration.
    
    Args:
        data_type: 'ellipse', 'diagonal', 'circular'
        n_points: Number of points to generate
        noise: Amount of noise to add
    
    Returns:
        numpy array of shape (n_points, 2 or 3)
    """
    np.random.seed(42)
    
    if data_type == 'ellipse':
        # Generate elliptical data
        t = np.linspace(0, 2*np.pi, n_points)
        x = 3 * np.cos(t) + np.random.normal(0, noise, n_points)
        y = 1 * np.sin(t) + np.random.normal(0, noise, n_points)
        data = np.column_stack([x, y])
        
    elif data_type == 'diagonal':
        # Generate diagonal line with noise
        x = np.linspace(-3, 3, n_points)
        y = 2*x + 1 + np.random.normal(0, noise*5, n_points)
        data = np.column_stack([x, y])
        
    elif data_type == 'circular':
        # Generate circular data
        t = np.linspace(0, 2*np.pi, n_points)
        x = 2 * np.cos(t) + np.random.normal(0, noise, n_points)
        y = 2 * np.sin(t) + np.random.normal(0, noise, n_points)
        data = np.column_stack([x, y])
        
    elif data_type == '3d':
        # Generate 3D data
        t = np.linspace(0, 4*np.pi, n_points)
        x = 3 * np.cos(t) + np.random.normal(0, noise, n_points)
        y = 2 * np.sin(t) + np.random.normal(0, noise, n_points)
        z = t/2 + np.random.normal(0, noise*2, n_points)
        data = np.column_stack([x, y, z])
    
    else:
        # Default to ellipse
        t = np.linspace(0, 2*np.pi, n_points)
        x = 3 * np.cos(t) + np.random.normal(0, noise, n_points)
        y = 1 * np.sin(t) + np.random.normal(0, noise, n_points)
        data = np.column_stack([x, y])
    
    return data


def perform_pca(data, n_components=None, standardize=True):
    """
    Perform PCA on the data.
    
    Args:
        data: numpy array of shape (n_samples, n_features)
        n_components: Number of components to keep (None = all)
        standardize: Whether to standardize data before PCA
    
    Returns:
        Dictionary with PCA results
    """
    # Standardize data
    if standardize:
        scaler = StandardScaler()
        data_scaled = scaler.fit_transform(data)
    else:
        data_scaled = data
    
    # Determine number of components
    if n_components is None:
        n_components = min(data.shape)
    
    # Perform PCA
    pca = PCA(n_components=n_components)
    data_transformed = pca.fit_transform(data_scaled)
    
    # Get principal components (eigenvectors)
    components = pca.components_
    
    # Get explained variance
    explained_variance = pca.explained_variance_
    explained_variance_ratio = pca.explained_variance_ratio_
    cumulative_variance = np.cumsum(explained_variance_ratio)
    
    # Calculate mean of original data
    mean = np.mean(data_scaled, axis=0)
    
    # Scale components for visualization
    scaled_components = components * np.sqrt(explained_variance)[:, np.newaxis]
    
    return {
        'original_data': data.tolist(),
        'standardized_data': data_scaled.tolist(),
        'transformed_data': data_transformed.tolist(),
        'components': components.tolist(),
        'scaled_components': scaled_components.tolist(),
        'explained_variance': explained_variance.tolist(),
        'explained_variance_ratio': explained_variance_ratio.tolist(),
        'cumulative_variance': cumulative_variance.tolist(),
        'mean': mean.tolist(),
        'n_components': n_components,
        'original_shape': data.shape,
        'transformed_shape': data_transformed.shape
    }


def reconstruct_from_pca(transformed_data, components, mean, n_components_used=None):
    """
    Reconstruct original data from PCA components.
    
    Args:
        transformed_data: PCA-transformed data
        components: Principal components
        mean: Mean of original data
        n_components_used: Number of components to use for reconstruction
    
    Returns:
        Reconstructed data
    """
    transformed_data = np.array(transformed_data)
    components = np.array(components)
    mean = np.array(mean)
    
    if n_components_used is not None:
        transformed_data = transformed_data[:, :n_components_used]
        components = components[:n_components_used, :]
    
    reconstructed = np.dot(transformed_data, components) + mean
    
    return reconstructed.tolist()


def pca_from_csv(data_array, n_components=2):
    """
    Perform PCA on user-uploaded CSV data.
    
    Args:
        data_array: List of lists (rows and columns)
        n_components: Number of components to extract
    
    Returns:
        PCA results dictionary
    """
    try:
        data = np.array(data_array, dtype=float)
        
        # Ensure we have at least 2D data
        if len(data.shape) == 1:
            data = data.reshape(-1, 1)
        
        # Limit components to available dimensions
        n_components = min(n_components, data.shape[1], data.shape[0])
        
        result = perform_pca(data, n_components=n_components)
        return result
        
    except Exception as e:
        return {'error': str(e)}
