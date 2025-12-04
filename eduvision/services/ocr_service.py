import requests
from ..config import settings

HF_URL = "https://api-inference.huggingface.co/models/microsoft/trocr-base-handwritten"

headers = {"Authorization": f"Bearer {settings.HF_API_KEY}"}

def run_ocr(image_bytes):
    response = requests.post(
        HF_URL,
        headers=headers,
        data=image_bytes
    )
    return response.json()
