import marqo

mq = marqo.Client(url="http://localhost:8882")

def create_vindex(index_name="wardrobe-index"):
    return mq.create_index(
        index_name=index_name,
        type="unstructured",
        model="hf/all-mpnet-base-v2"
    )

def save_to_marqo(id, description, img_path, index_name="wardrobe-index"):
    doc = {
        "id": str(id),  # Ensure ID is a string
        "description": description,
        "image": f"file://{img_path}"
            }
    try:
        result = mq.index(index_name).add_documents(
            documents=[doc],
            tensor_fields=["description", "image"]  # Include both text and image fields for vectorization
        )
        print("Marqo index result:", result)
        return result
    except Exception as e:
        print(f"Error adding to Marqo: {str(e)}")
        raise

def get_style_candidates(query):
    results = mq.index("wardrobe-index").search(
        q=query,
        searchable_attributes=["description"],
        limit=20
    )
    return results["hits"]


