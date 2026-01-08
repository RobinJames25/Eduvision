from pydantic import BaseModel, EmailStr, Field, ConfigDict
from uuid import UUID

class SignUpRequest(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2)
    # Added max_length to stay within bcrypt's 72-character limit
    password: str = Field(min_length=6, max_length=72)

class SignInRequest(BaseModel):
    email: EmailStr
    password: str = Field(max_length=72)

class AuthResponse(BaseModel):
    # Changed from int to UUID to match your database
    id: UUID 
    email: EmailStr
    full_name: str
    access_token: str

    # This allows Pydantic to read data from SQLAlchemy objects
    model_config = ConfigDict(from_attributes=True)