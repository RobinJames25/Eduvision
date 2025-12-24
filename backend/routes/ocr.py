from fastapi import APIRouter, UploadFile, File
from ..services.ocr_service import run_ocr

router = APIRouter()

@router.post("/")
async def ocr_image(file: UploadFile = File(...)):
    # Determine file type
    ext = file.filename.lower().split(".")[-1]
    file_type = "pdf" if ext == "pdf" else "image"

    # Read file bytes
    file_bytes = await file.read()

    # Run OCR
    text = run_ocr(file_bytes, file_type=file_type)
    return {"extracted_text": text}
