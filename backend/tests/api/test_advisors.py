import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import patch, MagicMock

from app.main import app
from app.models.user import User
from app.api import deps
from app.core import security

# We mock get_current_advisor for testing the actual logic,
# and we will test the dependency itself separately.

def override_get_current_advisor():
    return "test-advisor-uuid"

def override_get_current_student():
    raise Exception("Should not reach here if admin dependency checked")

client = TestClient(app)

@pytest.fixture
def advisor_client():
    app.dependency_overrides[deps.get_current_advisor] = override_get_current_advisor
    yield client
    app.dependency_overrides.clear()

def test_get_analytics_overview(advisor_client):
    response = advisor_client.get("/api/v1/advisors/analytics")
    assert response.status_code == 200
    data = response.json()
    assert "average_score" in data
    assert "total_scans_30d" in data
    assert "top_missing_skill" in data

def test_get_students_list(advisor_client, db: Session):
    # Create a dummy student
    import uuid
    dummy_student = User(
        id=uuid.uuid4(),
        email="test_student_list@example.com",
        name="Test List Student",
        role="student"
    )
    db.add(dummy_student)
    db.commit()

    response = advisor_client.get("/api/v1/advisors/students")
    assert response.status_code == 200
    data = response.json()
    assert "students" in data
    assert "total_count" in data
    
    # Clean up
    db.delete(dummy_student)
    db.commit()

def test_get_student_analyses(advisor_client, db: Session):
    import uuid
    student_id = uuid.uuid4()
    dummy_student = User(
        id=student_id,
        email="test_analyses@example.com",
        name="Test Analyses Student",
        role="student"
    )
    db.add(dummy_student)
    db.commit()

    response = advisor_client.get(f"/api/v1/advisors/students/{student_id}/analyses")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

    db.delete(dummy_student)
    db.commit()

# --- Test the Dependency itself ---

@pytest.mark.asyncio
async def test_get_current_advisor_success(db: Session, mocker):
    import uuid
    advisor_id = uuid.uuid4()
    
    # 1. Create a real advisor user in DB
    advisor_user = User(
        id=advisor_id,
        email="test_dep_advisor@example.com",
        role="advisor"
    )
    db.add(advisor_user)
    db.commit()

    # 2. Mock verify_token to return this user's ID
    mocker.patch(
        "app.core.security.verify_token",
        return_value={"sub": str(advisor_id)}
    )
    
    # 3. Create a fake Creds object
    mock_creds = MagicMock()
    mock_creds.credentials = "fake-token"

    # 4. Call dependency
    result = await deps.get_current_advisor(creds=mock_creds, db=db)
    assert result == str(advisor_id)
    
    db.delete(advisor_user)
    db.commit()

@pytest.mark.asyncio
async def test_get_current_advisor_forbidden(db: Session, mocker):
    import uuid
    from fastapi import HTTPException
    
    student_id = uuid.uuid4()
    student_user = User(
        id=student_id,
        email="test_dep_student@example.com",
        role="student" # Not an advisor!
    )
    db.add(student_user)
    db.commit()

    mocker.patch(
        "app.core.security.verify_token",
        return_value={"sub": str(student_id)}
    )
    
    mock_creds = MagicMock()
    mock_creds.credentials = "fake-token"

    with pytest.raises(HTTPException) as excinfo:
        await deps.get_current_advisor(creds=mock_creds, db=db)
        
    assert excinfo.value.status_code == 403

    db.delete(student_user)
    db.commit()
