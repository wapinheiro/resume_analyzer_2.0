from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Resume Analyzer 2.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000", "https://resume-analyzer-2-0-flax.vercel.app"]

    # Database
    DATABASE_URL: str = "sqlite:///./sql_app.db"
    
    # GCP Cloud Storage
    GCS_BUCKET_NAME: str = "byu-resumes-bucket"
    GOOGLE_APPLICATION_CREDENTIALS: str = "backend/gcp-key.json"

    class Config:
        case_sensitive = True

settings = Settings()
