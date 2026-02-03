from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Resume Analyzer 2.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000", "https://resume-analyzer-2-0-flax.vercel.app"]

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/resume_analyzer"
    
    class Config:
        case_sensitive = True

settings = Settings()
