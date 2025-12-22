import requests
from utilities import encode_image, string_to_json


prompt = """
    You are a fashion tagging assistant. 
    Analyze the clothing item in this image and respond ONLY in JSON with the following fields:
    
    IMPORTANT: Your response must be valid JSON and nothing else. Do not include any markdown formatting or additional text.
    
    {
        "category": "",               
        "sub_category": "",           
        "primary_color": "",
        "secondary_color": "",
        "pattern": "",                
        "formality_level": 1,         
        "seasons": [],                
        "occasions": [],              
        "style_tags": [],             
        "gender_target": "",          
        "body_part": "",              
        "description": ""             
    }

    Definitions:
    - category: shirt, t-shirt, jeans, trousers, kurta, blazer, shoes, slippers, sneaker, sandal, etc.
    - sub_category: casual, formal, ethnic, sportswear.
    - primary_color: dominant visible color.
    - pattern: solid, striped, checked, floral, graphic.
    - formality_level: 1=very casual, 5=very formal.
    - seasons: list of ["summer", "winter", "monsoon", "all"].
    - occasions: ["office", "casual", "party", "date", "wedding", "travel", "festival"].
    - gender_target: menswear, womenswear, unisex.
    - body_part: upper, lower, footwear, outerwear, accessory.
    """

local_url = "http://127.0.0.1:8034/v1/chat/completions"


def analyze_clothing(img_path):
    img_b64 = encode_image(img_path)
    print("analyzing clothing.....")
    data = {
        "model": "Qwen3-VL-4B-Instruct-GGUF:Q4_K_M",
        "messages": [
            {
                    "role": "system",
                    "content": "You are a helpful assistant that extracts structured metadata from clothing images. Respond ONLY with valid JSON that matches the required schema."
                },
           {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{img_b64}",
                                "detail": "high"
                            }
                        }
                    ]
                }
        ],
    }

    response = requests.post(local_url, json=data)
    text = response.json()["choices"][0]["message"]["content"]
    json_response = string_to_json(text)
    return json_response

def score_outfit(outfit, occasion, weather, style_pref):
    prompt = f"""
    Rate this outfit for the given scenario.

    Outfit:
    Top: {outfit['top']['description']}
    Bottom: {outfit['bottom']['description']}
    Footwear: {outfit['shoes']['description']}

    Occasion: {occasion}
    Weather: {weather}
    User Style Preference: {style_pref}

    Return ONLY JSON with:
    {{
      "color_harmony": int (1-10),
      "occasion_fit": int (1-10),
      "style_alignment": int (1-10),
      "weather_suitability": int (1-10),
      "overall_score": float,
      "reason": "short explanation"
    }}
    """

    data = {
        "model": "Qwen3-VL-4B-Instruct-GGUF:Q4_K_M",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "logprobs": 1
    }

    response = requests.post(local_url, json=data)

    text = response.json()["choices"][0]["message"]["content"]
    json_response = string_to_json(text)
    return json_response

def explain_outfit(outfit):
    prompt = f"""
    Create a friendly stylist explanation for this outfit:

    {outfit}

    Include:
    - Why it works
    - Color reasoning
    - Style reasoning
    - One optional alternative suggestion
    """

    data = {
        "model": "Qwen3-VL-4B-Instruct-GGUF:Q4_K_M",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "logprobs": 1
    }

    response = requests.post(local_url, json=data)

    text = response.json()["choices"][0]["message"]["content"]
    json_response = string_to_json(text)
    return json_response

def extract_style_preferences(query: str) -> dict:
    """
    Extract style preferences from a natural language query using LLM.
    Returns a dictionary with occasion, weather, and style_pref.
    """
    prompt = f"""
    Extract style preferences from the following query. Return ONLY valid JSON with these fields:
    {{
        "occasion": "casual/formal/business/party/date/wedding/workout/beach or null if not specified",
        "weather": "warm/cold/hot/rainy/snowy/sunny/windy or null if not specified",
        "style_pref": "minimalist/bohemian/sporty/business/casual/elegant/streetwear or null if not specified"
    }}

    Query: "{query}"
    """

    try:
        response = requests.post(
            local_url,
            json={
                "model": "Qwen3-VL-4B-Instruct-GGUF:Q4_K_M",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a fashion assistant that extracts style preferences from text. Respond ONLY with valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.1
            }
        )
        
        result = response.json()
        content = result["choices"][0]["message"]["content"]
        return string_to_json(content)
        
    except Exception as e:
        print(f"Error extracting style preferences: {str(e)}")
        return {
            "occasion": None,
            "weather": None,
            "style_pref": None
        }