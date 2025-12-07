import os
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import List, Dict, Any
import uvicorn
from pymongo import MongoClient
from dotenv import load_dotenv
import marqo

# Import existing modules
from database import get_items_by_id, save_item_to_db, clothes
from v_database import mq, save_to_marqo, get_style_candidates
from processor import process_image, categorize, generate_candidates, score_outfits
from utilities import encode_image, convert_heic_to_jpeg
from ask_llm import analyze_clothing, score_outfit, explain_outfit, extract_style_preferences

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Personal Stylist API",
    description="API for personal stylist application",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, you might want to restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add this after your existing imports
UPLOAD_FOLDER = "/Users/raj/Documents/GitHub/personal-stylist/wardrobe_images/"

# Create the upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    # Get file extension and check if it's a supported format
    file_extension = os.path.splitext(file.filename)[1].lower()
    is_heic = file_extension in {'.heic', '.heif'}
    allowed_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'}
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}"
        )
    
    try:
        # Read the file content
        content = await file.read()
        
        # Generate a unique filename
        unique_filename = f"{str(uuid.uuid4())}.jpg" if is_heic else f"{str(uuid.uuid4())}{file_extension}"
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        
        # Save the file
        with open(file_path, "wb") as buffer:
            if is_heic:
                # Save HEIC temporarily
                temp_heic = f"{file_path}.heic"
                with open(temp_heic, "wb") as f:
                    f.write(content)
                # Convert to JPEG
                jpeg_path = convert_heic_to_jpeg(temp_heic)
                # Read the converted file
                with open(jpeg_path, "rb") as jpeg_file:
                    buffer.write(jpeg_file.read())
                # Clean up
                os.remove(temp_heic)
                if os.path.exists(jpeg_path):
                    os.remove(jpeg_path)
            else:
                # For non-HEIC files, save directly
                buffer.write(content)
        
        # Process the image and save to database if needed
        # item_data = process_image(file_path)
        # save_item_to_db(unique_filename, item_data, file_path)
        
        return JSONResponse(
            status_code=200,
            content={
                "message": "File uploaded and converted successfully" if is_heic else "File uploaded successfully",
                "filename": unique_filename,
                "file_path": file_path,
                "converted_from_heic": is_heic
            }
        )
        
    except Exception as e:
        # Clean up the file if something goes wrong
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/analyze/clothing/")
async def analyze_clothing_endpoint(image_path: str):
    """
    Endpoint to analyze clothing and generate tags.
    Accepts a path to an image and returns structured metadata.
    """
    # Validate the image path exists
    if not os.path.exists(image_path):
        raise HTTPException(
            status_code=400,
            detail="Image file not found at the specified path"
        )
    
    # Check if it's a file
    if not os.path.isfile(image_path):
        raise HTTPException(
            status_code=400,
            detail="The specified path is not a file"
        )
    
    # Check file extension
    file_extension = os.path.splitext(image_path)[1].lower()
    allowed_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'}
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}"
        )
    
    try:
        # Analyze the clothing
        analysis_result = analyze_clothing(image_path)
        analysis_result['image_path'] = image_path
        
        return analysis_result
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing image: {str(e)}"
        )

@app.post("/items/")
async def create_item(item_data: dict):
    """
    Endpoint to save a clothing item to the database.
    Expects a dictionary with the item data including image_path.
    """
    try:
            # Validate required fields
            # required_fields = ["image_path", "category", "sub_category"]
            # for field in required_fields:
            #     if field not in item_data:
            #         raise HTTPException(
            #             status_code=400,
            #             detail=f"Missing required field: {field}"
            #         )
            
            # Generate a unique ID
        item_id = str(uuid.uuid4())
        
        # Save to database
        save_item_to_db(item_id, item_data)
        
        # Return success response
        return {
            "message": "Item saved successfully",
            "item_id": item_id,
            "image_path": item_data["image_path"]
        }
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error saving item to database: {str(e)}"
        )

@app.post("/items/vector/")
async def create_vector_item(item_data: dict):
    """
    Endpoint to save a clothing item to the Marqo vector database.
    Expects a dictionary with 'image_path' and 'description' fields.
    """
    try:
        # Validate required fields
        required_fields = ["image_path", "description"]
        for field in required_fields:
            if field not in item_data:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing required field: {field}"
                )
        
        # Generate a unique ID if not provided
        item_id = str(uuid.uuid4())
        
        # Save to Marqo
        result = save_to_marqo(
            id=item_id,
            description=item_data["description"],
            img_path=item_data["image_path"]
        )
        
        # Return success response
        return {
            "message": "Item saved to vector database successfully",
            "item_id": item_id,
            "marqo_result": result
        }
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error saving item to vector database: {str(e)}"
        )

from fastapi import HTTPException
from bson import ObjectId

@app.get("/items/mongodb/{item_id}")
async def get_mongodb_item(item_id: str):
    """
    Retrieve an item from MongoDB by its ID.
    """
    try:
        # Try to convert to ObjectId if it's a valid MongoDB ObjectId
        try:
            item = clothes.find_one({"_id": ObjectId(item_id)})
        except:
            item = clothes.find_one({"_id": item_id})
        
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        
        # Convert ObjectId to string for JSON serialization
        if "_id" in item:
            item["_id"] = str(item["_id"])
            
        return item
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving item from MongoDB: {str(e)}"
        )

@app.get("/search/style/")
async def search_style_candidates(query: str = Query(..., description="Search query for style recommendations")):
    """
    Search for style candidates based on a text query.
    Returns the top 20 matching items from the vector database.
    """
    try:
        if not query or not query.strip():
            raise HTTPException(
                status_code=400,
                detail="Search query cannot be empty"
            )
        
        # Get style candidates
        results = get_style_candidates(query)
        results = get_items_by_id(results)
        
        return {
            "message": "Got matching style candidates",
            "count": len(results),
            "results": results
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error searching for style candidates: {str(e)}"
        )

@app.post("/outfits/categorize/")
async def categorize_items(items: List[dict]):
    """
    Categorize a list of clothing items into their respective slots.
    Expects a list of item dictionaries from MongoDB.
    """
    try:
        if not items or not isinstance(items, list):
            raise HTTPException(
                status_code=400,
                detail="Input must be a non-empty list of items"
            )
        
        # Categorize the items
        categorized = categorize(items)
        
        # Get the count of items in each category
        category_counts = {k: len(v) for k, v in categorized.items()}
        
        return {
            "message": "Items categorized successfully",
            "category_counts": category_counts,
            "categorized_items": categorized
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error categorizing items: {str(e)}"
        )

@app.post("/outfits/generate/")
async def generate_outfits(slots: dict):
    """
    Generate all possible outfit combinations from categorized items.
    Expects a dictionary with categorized items like:
    {
        "top": [...],
        "bottom": [...],
        "shoes": [...],
        "outerwear": [...]
    }
    """
    try:
        # Validate input structure
        required_slots = ["top", "bottom"]
        for slot in required_slots:
            if slot not in slots or not isinstance(slots[slot], list):
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing or invalid required slot: {slot}"
                )

        # Ensure optional slots exist
        for slot in ["shoes", "outerwear"]:
            if slot not in slots:
                slots[slot] = []

        # Generate outfit combinations
        outfits = generate_candidates(slots)

        return {
            "message": "Outfit combinations generated successfully",
            "total_combinations": len(outfits),
            "outfits": outfits
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating outfit combinations: {str(e)}"
        )

@app.get("/extract-preferences/")
async def extract_preferences_from_query(
    query: str = Query(..., description="Natural language query to extract style preferences from")
):
    """
    Extract style preferences (occasion, weather, style) from a natural language query.
    Uses LLM to intelligently identify and extract the relevant information.
    """
    try:
        if not query or not query.strip():
            raise HTTPException(
                status_code=400,
                detail="Query cannot be empty"
            )
        
        # Extract preferences using the LLM
        preferences = extract_style_preferences(query)
        
        return {
            "message": "Preferences extracted successfully",
            "preferences": preferences
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error extracting preferences: {str(e)}"
        )

@app.post("/outfits/score/")
async def get_best_outfit(
    items: List[Dict],
    occasion: str = None,
    weather: str = None,
    style_pref: str = None
):
    """
    Generate all possible outfit combinations, score them, and return the best one.
    Expects a list of clothing items from MongoDB.
    """
    try:
        if not items or not isinstance(items, list):
            raise HTTPException(
                status_code=400,
                detail="Input must be a non-empty list of items"
            )
        
        # Categorize the items
        slots = categorize(items)
        
        # Generate all possible combinations
        outfits = generate_candidates(slots)
        
        if not outfits:
            raise HTTPException(
                status_code=400,
                detail="Could not generate any valid outfit combinations"
            )
        
        # Score the outfits
        score_outfits(outfits, occasion, weather, style_pref)
        
        # Get the best outfit
        best_outfit = max(outfits, key=lambda x: x["score"])
        
        return {
            "message": "Best outfit selected successfully",
            "best_outfit": best_outfit,
            "total_combinations": len(outfits),
            "score": best_outfit["score"],
            "reason": best_outfit.get("reason", "")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error selecting best outfit: {str(e)}"
        )

# Add this after your other imports
app.mount("/api/images", StaticFiles(directory=UPLOAD_FOLDER), name="images")

@app.get("/api/wardrobe", response_model=List[Dict[str, Any]])
async def get_wardrobe_items():
    """
    Retrieve all clothing items with their image paths and body parts.
    Returns a list of dictionaries containing 'image_path' and 'body_part' for each item.
    """
    try:
        # Get all items from the clothes collection, projecting only the required fields
        items = list(clothes.find(
            {},
            {
                "image_path": 1,
                "body_part": 1,
                "category": 1,
                "_id": 0  # Exclude the _id field from the response
            }
        ))

        return items
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving wardrobe items: {str(e)}"
        )

@app.get("/api/images/{filename}")
async def get_image(filename: str):
    """Serve images from the wardrobe_images directory"""
    image_path = os.path.join(UPLOAD_FOLDER, filename)  # Use UPLOAD_FOLDER here
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(image_path)