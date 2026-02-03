import numpy as np

def calculate_vector_properties(v1_list, v2_list=None):
    """
    Calculates properties for one or two vectors.
    vectors are passed as lists [x, y, z] (or [x, y]).
    """
    v1 = np.array(v1_list, dtype=float)
    
    results = {
        "v1": {
            "components": v1_list,
            "magnitude": float(np.linalg.norm(v1)),
            "direction_cosines": (v1 / np.linalg.norm(v1)).tolist() if np.linalg.norm(v1) != 0 else [0,0,0]
        }
    }

    if v2_list:
        v2 = np.array(v2_list, dtype=float)
        
        # Dot Product
        dot_product = float(np.dot(v1, v2))
        
        # Angle
        mag_v1 = np.linalg.norm(v1)
        mag_v2 = np.linalg.norm(v2)
        
        if mag_v1 == 0 or mag_v2 == 0:
            angle_rad = 0
            angle_deg = 0
        else:
            cos_theta = dot_product / (mag_v1 * mag_v2)
            cos_theta = np.clip(cos_theta, -1.0, 1.0) # Numerical stability
            angle_rad = float(np.arccos(cos_theta))
            angle_deg = float(np.degrees(angle_rad))

        # Projection of v1 onto v2
        # proj_v1_on_v2 = (v1 . v2 / |v2|^2) * v2
        if mag_v2 == 0:
            proj = np.zeros_like(v2)
        else:
            scalar_proj = dot_product / (mag_v2**2)
            proj = scalar_proj * v2

        results["v2"] = {
            "components": v2_list,
            "magnitude": float(mag_v2)
        }
        results["interactions"] = {
            "dot_product": dot_product,
            "angle_degrees": round(angle_deg, 2),
            "angle_radians": round(angle_rad, 4),
            "projection_v1_on_v2": proj.tolist()
        }
        
        # Addition / Subtraction
        results["addition"] = (v1 + v2).tolist()
        results["subtraction"] = (v1 - v2).tolist()

    return results
