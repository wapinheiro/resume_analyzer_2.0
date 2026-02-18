from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Resume Analyzer 2.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS - configurable via environment
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "https://resume-analyzer-2-0-flax.vercel.app"
    ]

    # Database - configurable via environment
    # Default to SQLite for local dev, override with PostgreSQL for production
    DATABASE_URL: str = "sqlite:///./sql_app.db"
    
    # GCP Cloud Storage
    GCS_BUCKET_NAME: str = "byu-resumes-bucket"
    
    # Google API Key for Gemini AI
    GOOGLE_API_KEY: str | None = None
    
    # GCP credentials - Cloud Run uses default service account
    # Only needed for local development
    GOOGLE_APPLICATION_CREDENTIALS: str | None = None

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
