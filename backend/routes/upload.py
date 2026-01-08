import os
import io
import uuid
import json
import aiofiles
import pytesseract
from groq import Groq  # <--- New Import
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from pdf2image import convert_from_bytes
from PIL import Image

from ..database import get_db
from ..models.document import Document
from ..models.flashcard import Flashcard

router = APIRouter()

# -----------------------------
# Groq Configuration
# -----------------------------
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
# Using Llama 3.3-70b (High intelligence, high speed)
MODEL_NAME = "llama-3.3-70b-versatile"

async def generate_flashcards_groq(text: str):
    if not text.strip() or len(text) < 50:
        return []

    try:
        # Groq is fast enough that we don't strictly need async, 
        # but we wrap the call for consistency.
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": "You are an educational assistant. Output ONLY a valid JSON array of flashcards with 'question' and 'answer' keys."
                },
                {
                    "role": "user",
                    "content": f"Generate flashcards from this text:\n\n{text[:15000]}"
                }
            ],
            response_format={"type": "json_object"} # Forces JSON mode
        )
        
        # Groq returns a JSON object, we need to extract the array
        raw_output = json.loads(completion.choices[0].message.content)
        
        # If the model wraps it in a key like "flashcards", extract it
        if isinstance(raw_output, dict):
            return raw_output.get("flashcards", list(raw_output.values())[0])
        return raw_output

    except Exception as e:
        print(f"❌ Groq API Error: {str(e)}")
        raise HTTPException(status_code=500, detail="AI processing failed.")

# -----------------------------
# Route Implementation
# -----------------------------
@router.post("/")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # 1. Validation
    if file.content_type not in ("application/pdf", "image/jpeg", "image/png"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    # 2. Save file
    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{uuid.uuid4()}.{file.filename.split('.')[-1]}"
    file_bytes = await file.read()
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(file_bytes)

    # 3. OCR
    # (Using the same run_ocr function from previous steps)
    extracted_text = await run_ocr(file_bytes, file.content_type)
    if not extracted_text.strip():
        raise HTTPException(status_code=422, detail="No text found.")

    # 4. AI Generation (Now using Groq)
    flashcards_data = await generate_flashcards_groq(extracted_text)

    # 5. Database Save
    final_cards = []
    for fc in flashcards_data:
        card = Flashcard(
            user_id="temp",
            question=fc.get("question", "N/A"),
            answer=fc.get("answer", "N/A")
        )
        db.add(card)
        db.commit()
        db.refresh(card)
        final_cards.append({"id": card.id, "question": card.question, "answer": card.answer})

    return {"document_id": "success", "flashcards": final_cards}

# Helper OCR function (ensure this is in your file)
async def run_ocr(file_content: bytes, content_type: str) -> str:
    try:
        if content_type in ("image/jpeg", "image/png"):
            img = Image.open(io.BytesIO(file_content)).convert("RGB")
            return pytesseract.image_to_string(img)
        if content_type == "application/pdf":
            pages = convert_from_bytes(file_content)
            return " ".join(pytesseract.image_to_string(p) for p in pages)
    except Exception as e:
        print(f"OCR Error: {e}")
    return ""