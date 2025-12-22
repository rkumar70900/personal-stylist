import json
import base64
from PIL import Image
import pillow_heif
import os

def encode_image(img_path):
    with open(img_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def string_to_json(json_string):
    if not isinstance(json_string, str):
        raise TypeError("Input must be a string")
    try:
        return json.loads(json_string)
    except json.JSONDecodeError as e:
        raise json.JSONDecodeError(f"Invalid JSON string: {str(e)}", e.doc, e.pos)

def top_n(items, n=3):
    return items[:n]

def convert_heic_to_jpeg(heic_path):
    """Convert HEIC image to JPEG format using pillow_heif"""
    try:
        # Register HEIF opener with Pillow
        pillow_heif.register_heif_opener()
        
        # Open the HEIC file and convert to RGB
        image = Image.open(heic_path).convert('RGB')
        
        # Create output path with .jpg extension
        jpeg_path = os.path.splitext(heic_path)[0] + ".jpg"
        
        # Save as JPEG with high quality
        image.save(jpeg_path, "JPEG", quality=95)
        return jpeg_path
    except Exception as e:
        print(f"Error converting {heic_path} to JPEG: {e}")
        return None