from fastapi import APIRouter, UploadFile, File
from ..services.ocr_service import run_ocr

router = APIRouter()

@router.post("/")
async def ocr_image(file: UploadFile = File(...)):
    text = run_ocr(await file.read())
    return {"extracted_text": text}
