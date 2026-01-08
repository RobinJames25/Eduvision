from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# 🔥 Load .env at the very top
load_dotenv()

# Import routers
# Ensure these files exist in your 'routes' folder
from .routes import upload, ocr, qa, solve, flashcards, auth

app = FastAPI(title="Eduvision API", version="1.0.0")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Ensure this matches your Vite port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routes ---
# We change "/upload" to "/documents" to match our React fetch call
app.include_router(upload.router, prefix="/documents", tags=["Documents"])

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(flashcards.router, prefix="/flashcards", tags=["Flashcards"])

# Other utility routes
app.include_router(ocr.router, prefix="/ocr", tags=["OCR"])
app.include_router(qa.router, prefix="/qa", tags=["Q&A"])
app.include_router(solve.router, prefix="/solve", tags=["Solver"])

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "EduVision API is running",
        "gemini_status": "configured" if os.getenv("GOOGLE_API_KEY") else "missing_key"
    }