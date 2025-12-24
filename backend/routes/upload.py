from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.document import Document
from ..models.flashcard import Flashcard

import uuid
import os
import io
import re
import aiofiles
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image

from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

router = APIRouter()

# -----------------------------
# Load HL Question Generator
# -----------------------------
MODEL_NAME = "valhalla/t5-small-qg-hl"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

qg_pipeline = pipeline(
    "text2text-generation",
    model=model,
    tokenizer=tokenizer,
    device=-1  # CPU
)

# -----------------------------
# OCR Helper
# -----------------------------
async def run_ocr(file_content: bytes, content_type: str) -> str:
    try:
        if content_type in ("image/jpeg", "image/png"):
            img = Image.open(io.BytesIO(file_content)).convert("RGB")
            return pytesseract.image_to_string(img)

        if content_type == "application/pdf":
            pages = convert_from_bytes(file_content)
            return " ".join(
                pytesseract.image_to_string(p) for p in pages
            )

    except Exception as e:
        print("OCR Error:", e)

    return ""

# -----------------------------
# OCR Cleanup (CRITICAL)
# -----------------------------
def clean_ocr_text(text: str) -> str:
    # Fix hyphenated line breaks: mul- berries → mulberries
    text = re.sub(r"(\w+)-\s+(\w+)", r"\1\2", text)

    # Remove line breaks mid-sentence
    text = re.sub(r"\n+", " ", text)

    # Normalize spaces
    text = re.sub(r"\s{2,}", " ", text)

    return text.strip()

# -----------------------------
# Sentence Chunking
# -----------------------------
def chunk_text(text: str, max_chars: int = 350, limit: int = 6):
    sentences = re.split(r"(?<=[.!?])\s+", text)
    chunks = []

    for s in sentences:
        s = s.strip()
        if 40 <= len(s) <= max_chars:
            chunks.append(s)
        if len(chunks) >= limit:
            break

    return chunks

# -----------------------------
# Question Normalization
# -----------------------------
def normalize_question(q: str) -> str | None:
    q = q.strip()

    if not q.endswith("?"):
        return None

    # Reject statement-style questions
    bad_starts = (
        "Hassan", "We ", "He ", "She ", "They ",
        "The ", "I ", "Our "
    )
    if q.startswith(bad_starts):
        return None

    return q[0].upper() + q[1:]

# -----------------------------
# Generate Flashcards
# -----------------------------
def generate_flashcards(passage: str):
    if not passage.strip():
        return []

    cleaned = clean_ocr_text(passage)
    chunks = chunk_text(cleaned)
    flashcards = []

    for sentence in chunks:
        prompt = (
            "Generate one clear WH-question.\n"
            f"context: <hl> {sentence} <hl>"
        )

        try:
            result = qg_pipeline(
                prompt,
                max_length=64,
                num_beams=4,
                do_sample=False
            )[0]["generated_text"]

            question = normalize_question(
                result.split("?")[0] + "?"
            )

            if question:
                flashcards.append({
                    "question": question,
                    "answer": ""
                })

        except Exception as e:
            print("QG Error:", e)

    return flashcards

# -----------------------------
# Upload Route
# -----------------------------
@router.post("/")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if file.content_type not in (
        "application/pdf",
        "image/jpeg",
        "image/png"
    ):
        raise HTTPException(400, "Only PDF and image files allowed")

    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{uuid.uuid4()}-{file.filename}"

    file_bytes = await file.read()
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(file_bytes)

    extracted_text = await run_ocr(file_bytes, file.content_type)

    document = Document(
        user_id="temp",
        filename=file.filename,
        mime_type=file.content_type,
        storage_url=file_path
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    flashcards_data = generate_flashcards(extracted_text)
    final_cards = []

    for fc in flashcards_data:
        card = Flashcard(
            user_id="temp",
            question=fc["question"],
            answer=""
        )
        db.add(card)
        db.commit()
        db.refresh(card)

        final_cards.append({
            "id": str(card.id),
            "question": card.question,
            "answer": card.answer
        })

    return {
        "document_id": str(document.id),
        "file": file.filename,
        "extracted_text": extracted_text,
        "flashcards": final_cards
    }
