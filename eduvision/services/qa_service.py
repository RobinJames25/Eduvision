import requests
from ..config import settings

def ask_question(context, question):
    url = "https://router.huggingface.co/hf-inference/models/deepset/roberta-base-squad2"

    headers = {
        "Authorization": f"Bearer {settings.HF_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "inputs": {
            "question": question,
            "context": context
        }
    }

    res = requests.post(url, headers=headers, json=payload)

    if res.status_code != 200:
        raise Exception(
            f"Hugging Face API request failed with status {res.status_code}: {res.text}"
        )

    return res.json()
