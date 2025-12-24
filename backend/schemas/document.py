from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class DocumentOut(BaseModel):
    id: UUID
    user_id: str
    filename: str
    storage_url: str
    mime_type: str
    uploaded_at: datetime

    class Config:
        orm_mode = True
