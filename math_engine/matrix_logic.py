import numpy as np

def matrix_operations(operation, m1_list, m2_list=None):
    """
    Performs matrix operations.
    m1_list: list of lists (2D array)
    """
    try:
        m1 = np.array(m1_list, dtype=float)
        result = {}
        
        if operation == 'determinant':
            if m1.shape[0] != m1.shape[1]:
                return {"error": "Matrix must be square for determinant."}
            det = np.linalg.det(m1)
            result["value"] = round(det, 4)
            result["explanation"] = f"Determinant is {result['value']}"
            
        elif operation == 'inverse':
            if m1.shape[0] != m1.shape[1]:
                return {"error": "Matrix must be square for inverse."}
            try:
                inv = np.linalg.inv(m1)
                result["matrix"] = np.round(inv, 4).tolist()
            except np.linalg.LinAlgError:
                return {"error": "Matrix is singular (determinant is 0) and cannot be inverted."}

        elif operation == 'transpose':
            result["matrix"] = m1.T.tolist()

        elif operation == 'add':
            if not m2_list: return {"error": "Second matrix required"}
            m2 = np.array(m2_list, dtype=float)
            if m1.shape != m2.shape:
                return {"error": "Dimension mismatch for addition."}
            result["matrix"] = (m1 + m2).tolist()

        elif operation == 'subtract':
            if not m2_list: return {"error": "Second matrix required"}
            m2 = np.array(m2_list, dtype=float)
            if m1.shape != m2.shape:
                return {"error": "Dimension mismatch for subtraction."}
            result["matrix"] = (m1 - m2).tolist()

        elif operation == 'multiply':
            if not m2_list: return {"error": "Second matrix required"}
            m2 = np.array(m2_list, dtype=float)
            if m1.shape[1] != m2.shape[0]:
                return {"error": f"Dimension mismatch: {m1.shape} cannot multiply {m2.shape}"}
            result["matrix"] = np.dot(m1, m2).tolist()

        else:
            return {"error": "Unknown operation"}

        return result

    except Exception as e:
        return {"error": str(e)}
