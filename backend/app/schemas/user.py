from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class UserCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    major: Optional[str] = None
    graduation_year: Optional[int] = None
    student_status: str = "active_student"

class UserLogin(BaseModel):
    email: str
    password: str

class UserRoleUpdate(BaseModel):
    role: str

class UserProfileUpdate(BaseModel):
    major: Optional[str] = None
    graduation_year: Optional[int] = None
    student_status: Optional[str] = None

class User(UserCreate):
    id: uuid.UUID
    role: str
    created_at: datetime
    last_login: Optional[datetime] = None
    major: Optional[str] = None
    graduation_year: Optional[int] = None
    student_status: str = "active_student"

    class Config:
        from_attributes = True
