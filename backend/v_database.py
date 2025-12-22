import marqo

mq = marqo.Client(url="http://localhost:8882")

def create_vindex(index_name="wardrobe-index"):
    return mq.create_index(
        index_name=index_name,
        type="unstructured",
        model="hf/all-mpnet-base-v2"
    )

def save_to_marqo(id, description, img_path, seasons, occasions, style_tags, body_part, index_name="wardrobe-index"):
    doc = {
        "id": str(id),  # Ensure ID is a string
        "description": description,
        "image": f"file://{img_path}",
        "seasons": seasons,
        "occasions": occasions,
        "style_tags": style_tags,
        "body_part": body_part
            }
    try:
        result = mq.index(index_name).add_documents(
            documents=[doc],
            tensor_fields=["description", "image", "seasons", "occasions", "style_tags", "body_part"]  # Include both text and image fields for vectorization
        )
        print("Marqo index result:", result)
        return result
    except Exception as e:
        print(f"Error adding to Marqo: {str(e)}")
        raise

def get_style_candidates(query, limit=5):
    """
    Search for clothing items matching the query, optionally filtered by body part.
    
    Args:
        query (str): The search query
        body_part (str, optional): Filter by body part ('upper', 'lower', 'footwear', 'outerwear')
        limit (int): Maximum number of results to return
        
    Returns:
        list: List of matching items with their scores and metadata
    """
    # Add body part filter if specified
    body_parts = ["upper", "lower", "footwear", "outerwear"]

    all_results = []
    
    for body_part in body_parts:
        query = f"{query} for body_part:{body_part}"
        results = mq.index("wardrobe-index").search(
            q=query,
            searchable_attributes=["description", "style_tags", "occasions", "body_part"],
            limit=limit
        )
        all_results.extend(results["hits"])
    
    return all_results


def delete_index(index_name="wardrobe-index"):
    try:
        result = mq.delete_index(index_name)
        print(f"Successfully deleted index: {index_name}")
        return result
    except Exception as e:
        print(f"Error deleting index {index_name}: {str(e)}")
        raise

def sync_mongodb_to_marqo():
    """
    Sync all records from MongoDB to Marqo.
    
    This function will:
    1. Fetch all documents from the MongoDB collection
    2. Insert each document into Marqo using save_to_marqo
    
    Returns:
        dict: Summary of the sync operation
    """
    from database import clothes  # Import MongoDB collection
    
    try:
        # Get all documents from MongoDB
        all_items = list(clothes.find({}))
        total_items = len(all_items)
        success_count = 0
        
        if total_items == 0:
            print("No items found in MongoDB collection")
            return {"status": "success", "message": "No items found in MongoDB collection"}
        
        print(f"Found {total_items} items to sync to Marqo")
        
        # Process each item
        for item in all_items:
            try:
                # Convert _id to string if it's an ObjectId
                item_id = str(item["_id"])
                
                # Call save_to_marqo with the required fields
                save_to_marqo(
                    id=item_id,
                    description=item.get("description", ""),
                    img_path=item.get("image_path", ""),
                    seasons=",".join(item.get("seasons", [])),
                    occasions=",".join(item.get("occasions", [])),
                    style_tags=",".join(item.get("style_tags", [])),
                    body_part=item.get("body_part", ""),
                    index_name="wardrobe-index"
                )
                success_count += 1
                print(f"Synced item {success_count}/{total_items}: {item_id}")
                
            except Exception as e:
                print(f"Error syncing item {item.get('_id', 'unknown')}: {str(e)}")
                continue
        
        return {
            "status": "completed",
            "total_items": total_items,
            "successful_syncs": success_count,
            "failed_syncs": total_items - success_count
        }
        
    except Exception as e:
        error_msg = f"Error syncing MongoDB to Marqo: {str(e)}"
        print(error_msg)
        return {"status": "error", "message": error_msg}


if __name__ == "__main__":
    delete_index()  # Uncomment if you need to delete the index first
    create_vindex()  # Make sure the index exists before syncing
    sync_mongodb_to_marqo()

