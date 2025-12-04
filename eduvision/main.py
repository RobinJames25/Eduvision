from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import upload, ocr, qa, solve, flashcards

app = FastAPI(title="Eduvision API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/upload")
app.include_router(ocr.router, prefix="/ocr")
app.include_router(qa.router, prefix="/qa")
app.include_router(solve.router, prefix="/solve")
app.include_router(flashcards.router, prefix="/flashcards")

@app.get("/")
def root():
    return {"message": "EduVision backend running"}