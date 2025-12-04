from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.document import Document
from ..models.flashcard import Flashcard
import uuid
import os
import io
from PIL import Image
import pytesseract
from pdf2image import convert_from_bytes
import re
import requests
import aiofiles

# Create router
router = APIRouter()

# Wolfram Alpha API (optional)
WOLFRAM_APP_ID = "YOUR_WOLFRAM_APP_ID"

async def run_ocr(file_content: bytes, content_type: str):
    """
    Runs OCR on images or PDFs.
    Returns extracted text.
    """
    try:
        if content_type in ["image/jpeg", "image/png"]:
            image = Image.open(io.BytesIO(file_content)).convert("RGB")
            return pytesseract.image_to_string(image)

        elif content_type == "application/pdf":
            pages = convert_from_bytes(file_content)
            text = ""
            for page in pages:
                text += pytesseract.image_to_string(page) + "\n"
            return text

        else:
            return None

    except Exception as e:
        print("OCR error:", e)
        return None

def extract_problems(text: str):
    """Split text into problems/questions."""
    problems = re.split(r"\n(?=\d+\.|\-|\*)", text)
    return [p.strip() for p in problems if p.strip()]

def detect_equation(problem_text: str):
    """Detect if text contains a math equation."""
    return bool(re.search(r"[\d\+\-\*/=]", problem_text))

def solve_equation(equation: str):
    """Query Wolfram Alpha API for solution."""
    if not WOLFRAM_APP_ID:
        return None
    url = "http://api.wolframalpha.com/v1/result"
    params = {"i": equation, "appid": WOLFRAM_APP_ID}
    try:
        response = requests.get(url, params=params, timeout=5)
        if response.status_code == 200:
            return response.text
    except Exception as e:
        print("Wolfram API error:", e)
    return None

@router.post("/")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Only accept PDFs or images
    if file.content_type not in ["application/pdf", "image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Only PDF and image files are supported.")

    # Ensure uploads folder exists
    os.makedirs("uploads", exist_ok=True)
    file_location = f"uploads/{uuid.uuid4()}-{file.filename}"
    content = await file.read()

    # Save file asynchronously
    async with aiofiles.open(file_location, "wb") as out_file:
        await out_file.write(content)

    # Step 1: OCR extraction
    extracted_text = await run_ocr(content, file.content_type)

    # Step 2: Save document record
    doc = Document(
        user_id="temp",  # Replace with actual user id from authentication
        filename=file.filename,
        mime_type=file.content_type,
        storage_url=file_location
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    flashcards = []

    if extracted_text:
        # Step 3: Extract problems/questions
        problems = extract_problems(extracted_text)

        for problem_text in problems:
            solution = None
            # Step 4: Solve equation if detected
            if detect_equation(problem_text):
                solution = solve_equation(problem_text)

            # Step 5: Save flashcard
            flashcard = Flashcard(
                user_id="temp",          # Required field
                question=problem_text,
                answer=solution or ""
            )
            db.add(flashcard)
            db.commit()
            db.refresh(flashcard)
            flashcards.append({
                "id": str(flashcard.id),
                "question": flashcard.question,
                "answer": flashcard.answer
            })

    return {
        "document_id": str(doc.id),
        "file": file.filename,
        "extracted_text": extracted_text,
        "flashcards": flashcards
    }
