const API_BASE_URL = "http://127.0.0.1:8000";

export interface ClothingItem {
  _id: string;
  image_path: string;
  category?: string;
  sub_category?: string;
  color?: string;
  pattern?: string;
  material?: string;
  style?: string;
  description?: string;
  [key: string]: any;
}

export interface UploadResponse {
  message: string;
  filename: string;
  file_path: string;
  converted_from_heic: boolean;
}

export interface AnalyzeResponse {
  category: string;
  sub_category: string;
  color: string;
  pattern: string;
  material: string;
  style: string;
  occasion: string[];
  season: string[];
  description: string;
  image_path: string;
}

export interface StylePreferences {
  occasion: string | null;
  weather: string | null;
  style_pref: string | null;
}

export interface OutfitResult {
  message: string;
  best_outfit: {
    top?: ClothingItem;
    bottom?: ClothingItem;
    shoes?: ClothingItem;
    outerwear?: ClothingItem;
    score: number;
    reason?: string;
  };
  total_combinations: number;
  score: number;
  reason: string;
}

// Upload a file
export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to upload file");
  }

  return response.json();
}

// Analyze clothing from image path
export async function analyzeClothing(imagePath: string): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze/clothing/?image_path=${encodeURIComponent(imagePath)}`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to analyze clothing");
  }

  return response.json();
}

// Save item to MongoDB
export async function saveItemToMongoDB(itemData: Record<string, any>): Promise<{ item_id: string }> {
  const response = await fetch(`${API_BASE_URL}/items/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itemData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to save item to MongoDB");
  }

  return response.json();
}

// Save item to Marqo vector database
export async function saveItemToMarqo(imagePath: string, description: string): Promise<{ item_id: string }> {
  const response = await fetch(`${API_BASE_URL}/items/vector/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_path: imagePath, description }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to save item to Marqo");
  }

  return response.json();
}

// Search for style candidates
export async function searchStyleCandidates(query: string): Promise<{ results: ClothingItem[] }> {
  const response = await fetch(`${API_BASE_URL}/search/style/?query=${encodeURIComponent(query)}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to search style candidates");
  }

  return response.json();
}

// Extract style preferences from query
export async function extractPreferences(query: string): Promise<{ preferences: StylePreferences }> {
  const response = await fetch(`${API_BASE_URL}/extract-preferences/?query=${encodeURIComponent(query)}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to extract preferences");
  }

  return response.json();
}

// Score outfits and get the best one
export async function getBestOutfit(
  items: ClothingItem[],
  occasion?: string | null,
  weather?: string | null,
  stylePref?: string | null
): Promise<OutfitResult> {
  const params = new URLSearchParams();
  if (occasion) params.append("occasion", occasion);
  if (weather) params.append("weather", weather);
  if (stylePref) params.append("style_pref", stylePref);

  const url = `${API_BASE_URL}/outfits/score/?${params.toString()}`;
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items),
  };
  const response = await fetch(url, requestOptions);
  
  console.log('Response status:', response.status, response.statusText);
  
  if (!response.ok) {
    let error;
    try {
      error = await response.json();
      console.error('Error response from server:', error);
    } catch (e) {
      const errorText = await response.text();
      console.error('Failed to parse error response:', errorText);
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }
    throw new Error(error.detail || "Failed to get best outfit");
  }

  return response.json();
}

// Get image URL
export function getImageUrl(filename: string): string {
  return `${API_BASE_URL}/api/images/${filename}`;
}

// Get all wardrobe items
export async function getWardrobeItems(): Promise<ClothingItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/wardrobe`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch wardrobe items');
  }
  
  return response.json();
}
