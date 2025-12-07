# Personal Stylist AI

An intelligent wardrobe assistant that helps you organize your clothing items and suggests perfect outfits based on occasion, weather, and style preferences.

![Personal Stylist Demo](https://via.placeholder.com/800x500.png?text=Personal+Stylist+Demo)

## ✨ Features

- **Smart Wardrobe Management**: Upload and categorize your clothing items with AI-powered tagging
- **Outfit Generation**: Get personalized outfit recommendations based on your wardrobe
- **Style Analysis**: Understand what makes your outfits work with detailed style explanations
- **Context-Aware Suggestions**: Get outfit recommendations tailored to specific occasions, weather, and style preferences
- **Visual Search**: Find similar items in your wardrobe using natural language descriptions

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **MongoDB**: NoSQL database for storing clothing items and metadata
- **Marqo**: Vector search for semantic clothing search
- **Qwen3-VL-4B-Instruct**: Multimodal AI model for image understanding and analysis
- **OpenAI API**: For natural language processing and style recommendations

### Frontend
- **React**: Frontend library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Beautifully designed components

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 16+
- MongoDB
- Marqo (for vector search)
- llama.cpp server (for local LLM inference)

#### Setting up llama.cpp Server

Before starting with the application, you'll need to set up the llama.cpp server to host the language model locally:

1. Follow the official [llama.cpp build documentation](https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md) to set up the server.
2. Make sure the server is running and accessible at `http://localhost:8080`.
3. Verify the server is running by checking the health endpoint:
   ```bash
   curl http://localhost:8080/health
   ```
   You should see a JSON response with `"status": "ok"` if the server is running correctly.

**Note:** The model will need sufficient RAM/VRAM to run. For best performance, ensure your system meets the requirements for your chosen model size.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/personal-stylist.git
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
   uvicorn backend.main:app --reload

   # In the frontend directory (new terminal)
   npm run dev
   ```

## 🧠 How It Works

1. **Upload Your Wardrobe**: Take photos of your clothing items and let the AI analyze and categorize them
2. **Get Recommendations**: Tell the system about your occasion, weather, and style preferences
3. **Discover Outfits**: Browse through AI-generated outfit combinations from your wardrobe
4. **Learn and Improve**: Get explanations about why certain items work well together

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
