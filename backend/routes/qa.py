from fastapi import APIRouter
from pydantic import BaseModel
from ..services.qa_service import ask_question

router = APIRouter()

class QARequest(BaseModel):
    context: str
    question: str

@router.post("/")
def qa(req: QARequest):
    response = ask_question(req.context, req.question)
    return {"answer": response}
