import numpy as np

def solve_system(lhs_list, rhs_list):
    """
    Solves Ax = b and returns steps for Gaussian Elimination.
    lhs_list: A matrix (list of lists)
    rhs_list: b vector (list)
    """
    try:
        A = np.array(lhs_list, dtype=float)
        b = np.array(rhs_list, dtype=float)
        
        # Combine into Augmented Matrix [A | b]
        aug = np.column_stack((A, b))
        rows, cols = aug.shape
        
        steps = []
        steps.append({"description": "Initial Augmented Matrix", "matrix": aug.tolist()})

        # Gaussian Elimination (Forward Integration)
        for i in range(min(rows, cols-1)):
            # 1. Pivot selection (Partial Pivoting)
            pivot_row = i + np.argmax(np.abs(aug[i:, i]))
            if i != pivot_row:
                aug[[i, pivot_row]] = aug[[pivot_row, i]]
                steps.append({"description": f"Swap R{i+1} with R{pivot_row+1}", "matrix": aug.tolist()})
            
            # 2. Normalize pivot row
            pivot_val = aug[i, i]
            if abs(pivot_val) > 1e-10:
                aug[i] = aug[i] / pivot_val
                steps.append({"description": f"Normalize R{i+1} (Divide by {pivot_val:.2f})", "matrix": aug.tolist()})
            else:
                # Singular or free variable case (simplified handling)
                pass 

            # 3. Eliminate entries below
            for j in range(i + 1, rows):
                factor = aug[j, i]
                if abs(factor) > 1e-10:
                    aug[j] = aug[j] - factor * aug[i]
                    steps.append({"description": f"R{j+1} = R{j+1} - ({factor:.2f} * R{i+1})", "matrix": aug.tolist()})

        # Back Substitution (Jordan)
        for i in range(min(rows, cols-1) - 1, -1, -1):
            for j in range(i - 1, -1, -1):
                factor = aug[j, i]
                if abs(factor) > 1e-10:
                    aug[j] = aug[j] - factor * aug[i]
                    steps.append({"description": f"R{j+1} = R{j+1} - ({factor:.2f} * R{i+1})", "matrix": aug.tolist()})

        solution = aug[:, -1]
        
        return {
            "steps": steps,
            "solution": solution.tolist(),
            "equations": {
                "A": A.tolist(),
                "b": b.tolist()
            }
        }

    except Exception as e:
        return {"error": str(e)}
