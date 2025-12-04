from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..services.flashcard_service import create_flashcard, get_user_flashcards
from ..schemas.flashcard import FlashcardCreate, FlashcardOut
from ..database import get_db

router = APIRouter()

@router.post("/", response_model=FlashcardOut)
def generate_flashcard(data: FlashcardCreate, db: Session = Depends(get_db)):
    flashcard = create_flashcard(data.user_id, data.question, data.answer, db)
    return flashcard

@router.get("/{user_id}", response_model=list[FlashcardOut])
def list_flashcards(user_id: str, db: Session = Depends(get_db)):
    return get_user_flashcards(user_id, db)
