import numpy as np

def calculate_eigen(matrix_list):
    """
    Calculates eigenvalues and velocities for a 2x2 matrix.
    """
    try:
        A = np.array(matrix_list, dtype=float)
        if A.shape != (2, 2):
            return {"error": "Only 2x2 matrices supported for this visualizer."}
            
        eigenvalues, eigenvectors = np.linalg.eig(A)
        
        # eigenvectors are columns in numpy result
        # Helper to format complex numbers
        def format_complex(val):
            if np.iscomplexobj(val):
                return {"real": float(val.real), "imag": float(val.imag)}
            return float(val)

        e_vals_formatted = [format_complex(x) for x in eigenvalues]
        
        # Eigenvectors (columns)
        v1 = eigenvectors[:, 0]
        v2 = eigenvectors[:, 1]
        
        # Note: If eigenvalues are complex, eigenvectors are complex too.
        def format_vec(vec):
            return [format_complex(x) for x in vec]

        v1_fmt = format_vec(v1)
        v2_fmt = format_vec(v2)
        
        return {
            "eigenvalues": e_vals_formatted, 
            "eigenvectors": [v1_fmt, v2_fmt],
            "matrix": A.tolist()
        }
    except Exception as e:
        return {"error": str(e)}
