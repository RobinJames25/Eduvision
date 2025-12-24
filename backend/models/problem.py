from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

from ..database import Base

class Problem(Base):
    __tablename__ = "problems"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"))
    user_id = Column(String)
    original_text = Column(Text)
    normalized_text = Column(Text)
    solved = Column(Boolean, default=False)
    solution_output = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
