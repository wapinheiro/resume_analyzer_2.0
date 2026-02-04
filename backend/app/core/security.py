from typing import Optional, Any
import httpx
from jose import jwt, jwk
from jose.utils import base64url_decode
from app.core.config import settings

# Helper to cache keys (simple in-memory cache)
_jwks_cache = {}

async def get_clerk_public_key(kid: str) -> Optional[str]:
    """
    Fetches the JWKS from Clerk and returns the public key for the given Key ID (kid).
    """
    jwks_url = f"https://helped-doberman-54.clerk.accounts.dev/.well-known/jwks.json" # TODO: Move domain to settings?

    if kid in _jwks_cache:
        return _jwks_cache[kid]

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(jwks_url)
            response.raise_for_status()
            jwks = response.json()
            
        for key in jwks.get("keys", []):
             if key.get("kid") == kid:
                 _jwks_cache[kid] = key
                 return key
                 
    except Exception as e:
        print(f"Failed to fetch JWKS: {e}")
        return None
    
    return None

async def verify_token(token: str) -> Optional[dict]:
    """
    Verifies the JWT token using Clerk's JWKS.
    """
    try:
        # Get Header to find Key ID
        headers = jwt.get_unverified_header(token)
        kid = headers.get("kid")
        
        if not kid:
            return None
            
        key_data = await get_clerk_public_key(kid)
        if not key_data:
            return None
            
        # Construct public key
        public_key = jwk.construct(key_data)
        
        # Verify
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=None, # Clerk often doesn't set aud by default unless configured
            options={"verify_aud": False} 
        )
        return payload

    except Exception as e:
        print(f"Token Verification Failed: {e}")
        return None
