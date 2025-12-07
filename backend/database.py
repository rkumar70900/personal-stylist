from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")

client = MongoClient(mongo_uri)
db = client["personal-stylist"]
clothes = db["clothes_local"]


def save_item_to_db(id, item):
    entry = {
        "_id": id,
        "image_path": item["image_path"],
        "category": item["category"],
        "sub_category": item["sub_category"],
        "primary_color": item["primary_color"],
        "secondary_color": item["secondary_color"],
        "pattern": item["pattern"],
        "formality_level": item["formality_level"],
        "seasons": item["seasons"],
        "occasions": item["occasions"],
        "style_tags": item["style_tags"],
        "gender_target": item["gender_target"],
        "body_part": item["body_part"],
        "description": item["description"],
    }

    clothes.insert_one(entry)
    print(f"Saved: {item["image_path"]}")

def get_items_by_id(hits):
    items = [clothes.find_one({"_id": hit["id"]}) for hit in hits]
    return items