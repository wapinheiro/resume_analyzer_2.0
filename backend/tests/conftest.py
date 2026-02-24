import pytest
from unittest.mock import MagicMock
import sys

# Mock google.cloud.storage before any app imports
sys.modules["google.cloud"] = MagicMock()
sys.modules["google.cloud.storage"] = MagicMock()

# Mock other external services if needed
from app.main import app
from fastapi.testclient import TestClient

from app.db.base_class import Base
from app.db.session import engine, SessionLocal

@pytest.fixture(scope="session", autouse=True)
def create_test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(autouse=True)
def mock_gcs_service(monkeypatch):
    """
    Mock the GCSService to avoid real network calls.
    """
    mock_service = MagicMock()
    mock_service.upload_file.return_value = "https://storage.googleapis.com/mock-bucket/mock-file.pdf"
    
    monkeypatch.setattr("app.services.gcs.gcs_service", mock_service)
    return mock_service

@pytest.fixture(autouse=True)
def mock_auth(monkeypatch):
    """
    Mock authentication to bypass Clerk verification.
    """
    async def mock_verify(*args, **kwargs):
        return {"sub": "test_user_id"}
    
    monkeypatch.setattr("app.core.security.verify_token", mock_verify)
