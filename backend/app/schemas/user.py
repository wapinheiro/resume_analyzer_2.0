from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class UserCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    avatar_url: Optional[str] = None

class User(UserCreate):
    id: uuid.UUID
    role: str
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True
