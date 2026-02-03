import numpy as np
from scipy.ndimage import convolve

def get_predefined_kernels():
    """Return dictionary of common convolution kernels."""
    return {
        'edge_detect': np.array([
            [-1, -1, -1],
            [-1,  8, -1],
            [-1, -1, -1]
        ]),
        'sharpen': np.array([
            [ 0, -1,  0],
            [-1,  5, -1],
            [ 0, -1,  0]
        ]),
        'blur': np.array([
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ]) / 9.0,
        'gaussian_blur': np.array([
            [1, 2, 1],
            [2, 4, 2],
            [1, 2, 1]
        ]) / 16.0,
        'emboss': np.array([
            [-2, -1,  0],
            [-1,  1,  1],
            [ 0,  1,  2]
        ]),
        'sobel_x': np.array([
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ]),
        'sobel_y': np.array([
            [-1, -2, -1],
            [ 0,  0,  0],
            [ 1,  2,  1]
        ]),
        'identity': np.array([
            [0, 0, 0],
            [0, 1, 0],
            [0, 0, 0]
        ])
    }


def apply_convolution(image_data, kernel_type='edge_detect', custom_kernel=None):
    """
    Apply convolution filter to image.
    
    Args:
        image_data: 2D or 3D numpy array (grayscale or RGB)
        kernel_type: Name of predefined kernel
        custom_kernel: Custom kernel matrix (overrides kernel_type)
    
    Returns:
        Dictionary with original, filtered image, and kernel
    """
    try:
        image = np.array(image_data)
        
        # Get kernel
        if custom_kernel is not None:
            kernel = np.array(custom_kernel)
        else:
            kernels = get_predefined_kernels()
            kernel = kernels.get(kernel_type, kernels['identity'])
        
        # Apply convolution
        if len(image.shape) == 2:
            # Grayscale image
            filtered = convolve(image, kernel, mode='constant')
        elif len(image.shape) == 3:
            # RGB image - apply to each channel
            filtered = np.zeros_like(image)
            for i in range(image.shape[2]):
                filtered[:, :, i] = convolve(image[:, :, i], kernel, mode='constant')
        else:
            return {'error': 'Invalid image dimensions'}
        
        # Clip values to valid range
        filtered = np.clip(filtered, 0, 255)
        
        return {
            'original': image.tolist(),
            'filtered': filtered.tolist(),
            'kernel': kernel.tolist(),
            'kernel_type': kernel_type,
            'image_shape': image.shape
        }
        
    except Exception as e:
        return {'error': str(e)}


def generate_sample_image(image_type='checkerboard', size=64):
    """
    Generate sample images for testing convolution.
    
    Args:
        image_type: 'checkerboard', 'gradient', 'circle', 'lines'
        size: Image size (size x size)
    
    Returns:
        numpy array representing grayscale image
    """
    if image_type == 'checkerboard':
        # Create checkerboard pattern
        image = np.zeros((size, size))
        square_size = size // 8
        for i in range(0, size, square_size):
            for j in range(0, size, square_size):
                if ((i // square_size) + (j // square_size)) % 2 == 0:
                    image[i:i+square_size, j:j+square_size] = 255
    
    elif image_type == 'gradient':
        # Horizontal gradient
        image = np.linspace(0, 255, size)
        image = np.tile(image, (size, 1))
    
    elif image_type == 'circle':
        # Circle in center
        image = np.zeros((size, size))
        center = size // 2
        radius = size // 3
        y, x = np.ogrid[:size, :size]
        mask = (x - center)**2 + (y - center)**2 <= radius**2
        image[mask] = 255
    
    elif image_type == 'lines':
        # Vertical lines
        image = np.zeros((size, size))
        for i in range(0, size, 8):
            image[:, i:i+2] = 255
    
    else:
        # Default checkerboard
        image = np.zeros((size, size))
        square_size = size // 8
        for i in range(0, size, square_size):
            for j in range(0, size, square_size):
                if ((i // square_size) + (j // square_size)) % 2 == 0:
                    image[i:i+square_size, j:j+square_size] = 255
    
    return image.astype(np.uint8)


def apply_convolution(image_data, kernel_type='edge_detect', custom_kernel=None):
    """
    Apply convolution filter to image.
    
    Args:
        image_data: 2D or 3D numpy array (grayscale or RGB)
        kernel_type: Name of predefined kernel
        custom_kernel: Custom kernel matrix (overrides kernel_type)
    
    Returns:
        Dictionary with original, filtered image, and kernel
    """
    try:
        image = np.array(image_data)
        
        # Get kernel
        if custom_kernel is not None:
            kernel = np.array(custom_kernel)
        else:
            kernels = get_predefined_kernels()
            kernel = kernels.get(kernel_type, kernels['identity'])
        
        # Apply convolution
        if len(image.shape) == 2:
            # Grayscale image
            filtered = convolve(image, kernel, mode='constant')
        elif len(image.shape) == 3:
            # RGB image - apply to each channel
            filtered = np.zeros_like(image)
            for i in range(image.shape[2]):
                filtered[:, :, i] = convolve(image[:, :, i], kernel, mode='constant')
        else:
            return {'error': 'Invalid image dimensions'}
        
        # Clip values to valid range
        filtered = np.clip(filtered, 0, 255)
        
        return {
            'original': image.tolist(),
            'filtered': filtered.tolist(),
            'kernel': kernel.tolist(),
            'kernel_type': kernel_type,
            'image_shape': image.shape
        }
        
    except Exception as e:
        return {'error': str(e)}


def generate_sample_image(image_type='checkerboard', size=64):
    """
    Generate sample images for testing convolution.
    
    Args:
        image_type: 'checkerboard', 'gradient', 'circle', 'lines'
        size: Image size (size x size)
    
    Returns:
        numpy array representing grayscale image
    """
    if image_type == 'checkerboard':
        # Create checkerboard pattern
        image = np.zeros((size, size))
        square_size = size // 8
        for i in range(0, size, square_size):
            for j in range(0, size, square_size):
                if ((i // square_size) + (j // square_size)) % 2 == 0:
                    image[i:i+square_size, j:j+square_size] = 255
    
    elif image_type == 'gradient':
        # Horizontal gradient
        image = np.linspace(0, 255, size)
        image = np.tile(image, (size, 1))
    
    elif image_type == 'circle':
        # Circle in center
        image = np.zeros((size, size))
        center = size // 2
        radius = size // 3
        y, x = np.ogrid[:size, :size]
        mask = (x - center)**2 + (y - center)**2 <= radius**2
        image[mask] = 255
    
    elif image_type == 'lines':
        # Vertical lines
        image = np.zeros((size, size))
        for i in range(0, size, 8):
            image[:, i:i+2] = 255
    
    else:
        # Default checkerboard
        image = np.zeros((size, size))
        square_size = size // 8
        for i in range(0, size, square_size):
            for j in range(0, size, square_size):
                if ((i // square_size) + (j // square_size)) % 2 == 0:
                    image[i:i+square_size, j:j+square_size] = 255
    
    return image.astype(np.uint8)
