def calculate_volumetric_weight(length, width, height):
    return (length * width * height) / 5000

def calculate_chargeable_weight(actual, volumetric):
    return max(actual, volumetric)