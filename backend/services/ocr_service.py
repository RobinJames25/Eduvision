import io
from PIL import Image, UnidentifiedImageError
import pytesseract
import pdf2image

def run_ocr(file_bytes: bytes, file_type: str = "image") -> str | None:
    """
    Extract text from images or PDFs using Tesseract OCR.
    """
    images = []

    try:
        if file_type == "pdf":
            # Convert PDF pages to images
            images = pdf2image.convert_from_bytes(file_bytes)
        else:
            # Convert bytes to PIL image
            try:
                image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
                images.append(image)
            except UnidentifiedImageError:
                print("OCR Error: uploaded file is not a valid image")
                return None

        # Extract text from all images
        full_text = []
        for img in images:
            text = pytesseract.image_to_string(img)
            full_text.append(text.strip())

        return "\n\n".join(full_text)

    except Exception as e:
        print("OCR Error:", e)
        return None
