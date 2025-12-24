from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    HF_API_KEY: str
    WOLFRAM_APP_ID: str
    OPENAI_API_KEY: str  # ✅ Added this

    class Config:
        env_file = ".env"
        extra = "allow"   # ✅ Prevents validation errors for extra vars

settings = Settings()
