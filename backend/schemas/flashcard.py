from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class FlashcardCreate(BaseModel):
    user_id: str
    question: str
    answer: str

class FlashcardOut(BaseModel):
    id: UUID
    user_id: str
    question: str
    answer: str
    created_at: datetime

    class Config:
        orm_mode = True
