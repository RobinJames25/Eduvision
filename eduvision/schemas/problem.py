from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class ProblemCreate(BaseModel):
    document_id: UUID
    user_id: str
    original_text: str

class ProblemOut(BaseModel):
    id: UUID
    document_id: UUID
    user_id: str
    original_text: str
    normalized_text: str | None
    solved: bool
    solution_output: str | None
    created_at: datetime

    class Config:
        orm_mode = True
