from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid 
from datetime import datetime

from ..database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, nullable=False)
    filename = Column(String)
    storage_url = Column(String)
    mime_type = Column(String)
    uploaded_at = Column(DateTime, default=datetime.utcnow)