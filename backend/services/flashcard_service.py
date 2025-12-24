from ..models.flashcard import Flashcard
from ..database import SessionLocal
from sqlalchemy.orm import Session

def create_flashcard(user_id: str, question: str, answer: str, db: Session):
    flashcard = Flashcard(
        user_id=user_id,
        question=question,
        answer=answer
    )
    db.add(flashcard)
    db.commit()
    db.refresh(flashcard)
    return flashcard

def get_user_flashcards(user_id: str, db: Session):
    return db.query(Flashcard).filter(Flashcard.user_id == user_id).all()
