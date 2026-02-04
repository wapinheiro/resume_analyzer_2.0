from typing import Generator, Optional
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core import security

# DB Dependency
def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

# Token Dependency
security_scheme = HTTPBearer(auto_error=False)

async def get_optional_user_id(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)
) -> Optional[str]:
    """
    Validates JWT if present. Returns user_id (sub) or None.
    Does not raise error if token is missing (optional auth).
    """
    if not creds:
        return None
    
    token = creds.credentials
    payload = await security.verify_token(token)
    
    if payload:
        return payload.get("sub")
    
    return None

async def get_current_user_id(
    user_id: Optional[str] = Depends(get_optional_user_id)
) -> str:
    """
    Enforces authentication. Raises 401 if valid token missing.
    """
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user_id
