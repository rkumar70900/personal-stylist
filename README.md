# Personal Stylist AI

An AI-powered wardrobe assistant that organizes your clothes and suggests perfect outfits using computer vision and natural language processing. Get personalized recommendations based on occasion, weather, and style preferences.

## 🎥 Demo

[Watch Demo Video](https://github.com/rkumar70900/personal-stylist/raw/main/personal_stylist_demo.mov)

## ✨ Features

- **Smart Wardrobe Management**: Upload and categorize your clothing items with AI-powered tagging
- **Intelligent Outfit Generation**: Get personalized, context-aware outfit recommendations
- **Natural Language Search**: Find outfits using natural language queries (e.g., "casual Friday office look")
- **Style Analysis**: Understand what makes your outfits work with detailed style explanations
- **Context-Aware Suggestions**: Get outfit recommendations tailored to specific occasions, weather, and style preferences
- **Visual Search**: Find similar items in your wardrobe using natural language descriptions
- **Outfit Scoring**: AI-powered scoring of outfit combinations based on multiple factors
- **Wardrobe Organization**: Automatic categorization of clothing items by type and style

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework for building the API
- **MongoDB**: NoSQL database for storing clothing items and metadata
- **Marqo**: Vector search for semantic clothing search and recommendations
- **Qwen3-VL-4B-Instruct-GGUF**: Multimodal AI model for image understanding and analysis
- **llama.cpp**: Local LLM inference server for style recommendations
- **OpenAI API**: For advanced natural language processing tasks

### Frontend
- **React 18**: Frontend library for building responsive user interfaces
- **TypeScript**: Type-safe JavaScript for better code quality
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: Beautifully designed, accessible components
- **TanStack Query**: Data fetching and state management
- **Zod**: TypeScript-first schema validation

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- MongoDB 6.0+
- Marqo (for vector search)
- llama.cpp server (for local LLM inference)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rkumar70900/personal-stylist.git
   cd personal-stylist
   ```

2. **Set up the backend**
   ```bash
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt

   # Set up environment variables
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Start the development servers**
   ```bash
   # In the backend directory
   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

   # In the frontend directory (new terminal)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - API Documentation: http://localhost:8000/docs

## 🧠 How It Works

1. **Upload Your Wardrobe**: Take photos of your clothing items and let the AI analyze and categorize them
2. **Natural Language Search**: Describe your desired outfit in natural language (e.g., "beach vacation outfit with hat")
3. **AI-Powered Matching**: The system uses vector search to find matching items from your wardrobe
4. **Context-Aware Recommendations**: Get outfit suggestions based on occasion, weather, and personal style
5. **Outfit Scoring**: Each generated outfit is scored based on style, occasion appropriateness, and weather compatibility
6. **Detailed Analysis**: Understand why certain items work well together with AI-generated style explanations

## 📚 API Endpoints

The backend provides the following key endpoints:

- `POST /upload/` - Upload and analyze clothing items
- `POST /analyze/` - Generate tags and metadata for clothing items
- `POST /items/` - Save clothing items to the database
- `GET /search/style/` - Search for style candidates
- `GET /outfit/components/` - Get outfit components by category
- `GET /outfit/best/` - Get the best matching outfit based on preferences
- `GET /wardrobe/` - Get all wardrobe items with images

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [llama.cpp](https://github.com/ggerganov/llama.cpp) for efficient local LLM inference
- [Marqo](https://marqo.ai/) for vector search capabilities
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components

## 📂 Project Structure

```
personal-stylist/
├── backend/               # FastAPI backend
│   ├── main.py            # Main FastAPI application
│   ├── database.py        # MongoDB operations
│   ├── v_database.py      # Vector database operations (Marqo)
│   ├── processor.py       # Image processing and outfit generation
│   ├── ask_llm.py         # AI model interactions
│   └── utilities.py       # Helper functions
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── lib/           # API and utility functions
├── wardrobe_images/       # Uploaded clothing images
└── requirements.txt       # Python dependencies
```

## 🌟 Features in Detail

### Smart Wardrobe
- Automatic tagging of clothing attributes (color, style, category)
- Visual organization by type, color, and season
- Outfit history and favorites

### Intelligent Outfitting
- Context-aware outfit generation
- Mix-and-match suggestions
- Weather-appropriate recommendations
- Occasion-based styling

### Style Insights
- Color harmony analysis
- Style compatibility scoring
- Personalized fashion tips
- Trend integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) for the awesome web framework
- [Marqo](https://marqo.ai/) for vector search capabilities
- [Qwen3-VL-4B-Instruct] for multimodal understanding
- All the amazing open-source projects that made this possible

---

<div align="center">
  Made with ❤️ by Your Name
</div>
