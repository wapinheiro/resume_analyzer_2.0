import pytest
from jose import jwt
from app.core.config import settings
from app.core.security import verify_token

@pytest.mark.asyncio
async def test_jwt_token_verification_success():
    """
    Regression Test: Verifies that JWT tokens signed with NEXTAUTH_SECRET 
    are successfully decoded and verified by the backend.
    """
    test_sub = "12345678-1234-1234-1234-1234567890ab"
    payload = {
        "sub": test_sub,
        "role": "student",
        "email": "student@byu.edu"
    }
    
    # Sign token using shared secret
    token = jwt.encode(payload, settings.NEXTAUTH_SECRET, algorithm="HS256")
    
    # Verify token
    decoded = await verify_token(token)
    assert decoded is not None, "Token verification failed: returned None"
    assert decoded.get("sub") == test_sub
    assert decoded.get("role") == "student"

@pytest.mark.asyncio
async def test_jwt_token_verification_mismatched_secret_fails():
    """
    Regression Test: Ensures that tokens signed with a mismatched secret 
    are rejected, catching secret misalignment regressions early.
    """
    payload = {"sub": "test-user", "role": "student"}
    wrong_secret = "mismatched-secret-key-that-should-fail"
    
    token = jwt.encode(payload, wrong_secret, algorithm="HS256")
    decoded = await verify_token(token)
    assert decoded is None, "Token signed with wrong secret should fail verification"
