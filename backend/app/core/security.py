from typing import Optional
from jose import jwt
from app.core.config import settings

async def verify_token(token: str) -> Optional[dict]:
    """
    Verifies the JWT token using NextAuth shared secret.
    We expect NextAuth to issue a standard HS256 JWT instead of JWE.
    """
    try:
        # Verify
        payload = jwt.decode(
            token,
            settings.NEXTAUTH_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False} 
        )
        return payload

    except Exception as e:
        print(f"Token Verification Failed: {e}")
        return None
