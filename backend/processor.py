import os
import json
import uuid
import itertools
from ask_llm import analyze_clothing, score_outfit
from database import save_item_to_db
from v_database import save_to_marqo
from utilities import top_n

def process_image(img_path):
    id = str(uuid.uuid4())
    metadata = analyze_clothing(img_path)
    save_item_to_db(id, metadata, img_path)
    save_to_marqo(id, metadata['description'], img_path)
    return id

def categorize(items):
    slots = { "top": [], "bottom": [], "shoes": [], "outerwear": [] }
    for i in items:
        if i is not None:
            part = i["body_part"]
            if part == "upper":
                slots["top"].append(i)
            elif part == "lower":
                slots["bottom"].append(i)
            elif part == "footwear":
                slots["shoes"].append(i)
            elif part == "outerwear":
                slots["outerwear"].append(i)
    return slots

def generate_candidates(slots):
    tops = top_n(slots["top"])
    print(tops, 'tops')
    bottoms = top_n(slots["bottom"])
    shoes = top_n(slots["shoes"])
    print(shoes, 'shoes')
    outerwear = top_n(slots["outerwear"])
    outfits = []
    for t, b, s, o in itertools.product(tops, bottoms, shoes, outerwear):
        outfits.append({
                "top": t,
                "bottom": b,
                "shoes": s,
                "outerwear": o,
            })

    return outfits

def score_outfits(outfits, occasion, weather, style_pref):
    for outfit in outfits:
        result = score_outfit(outfit, occasion, weather, style_pref)
        outfit["score"] = result["overall_score"]
        outfit["reason"] = result["reason"]
    best_outfit = max(outfits, key=lambda x: x["score"])
    return best_outfit