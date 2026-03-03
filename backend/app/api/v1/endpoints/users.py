from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.api import deps
from app.models.user import User
from app.schemas.user import UserCreate, User as UserSchema, UserLogin, UserRoleUpdate

router = APIRouter()

@router.post("/sync", response_model=UserSchema)
def sync_user(
    user_in: UserCreate,
    db: Session = Depends(deps.get_db)
):
    """
    Sync user from NextAuth. 
    If user doesn't exist by email, create them.
    If they do, update last_login, name, and avatar.
    Returns the User record which contains the Postgres UUID and role.
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    
    # Auto-assign advisor role to known admin emails (useful for testing on ephemeral DBs)
    admin_emails = ["wapinheiro@gmail.com", "wagner@cs.byu.edu"]
    assigned_role = "advisor" if user_in.email in admin_emails else "student"

    if not user:
        user = User(
            email=user_in.email,
            name=user_in.name,
            avatar_url=user_in.avatar_url,
            role=assigned_role,
            last_login=datetime.utcnow()
        )
        db.add(user)
    else:
        user.name = user_in.name or user.name
        user.avatar_url = user_in.avatar_url or user.avatar_url
        # Upgrade role if they are an admin but stuck as student
        if user.email in admin_emails and user.role not in ["advisor", "admin"]:
            user.role = "advisor"
        user.last_login = datetime.utcnow()

    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=UserSchema)
def login(
    login_data: UserLogin,
    db: Session = Depends(deps.get_db)
):
    """
    Hardcoded login route for admin and advisor testing.
    Normally this would verify passwords.
    """
    if login_data.email == "admin@byu.edu" and login_data.password == "admin":
        role = "admin"
        name = "System Administrator"
    elif login_data.email == "advisor@byu.edu" and login_data.password == "advisor":
        role = "advisor"
        name = "Lead Advisor"
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. For texting: admin@byu.edu/admin or advisor@byu.edu/advisor"
        )
    
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        user = User(
            email=login_data.email,
            name=name,
            role=role,
            last_login=datetime.utcnow()
        )
        db.add(user)
    else:
        user.last_login = datetime.utcnow()
    db.commit()
    db.refresh(user)
    return user

@router.get("/", response_model=List[UserSchema])
def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db)
):
    """Get all users for the admin dashboard."""
    users = db.query(User).order_by(User.created_at.desc()).offset(skip).limit(limit).all()
    return users

@router.patch("/{user_id}/role", response_model=UserSchema)
def update_user_role(
    user_id: str,
    role_data: UserRoleUpdate,
    db: Session = Depends(deps.get_db)
):
    """Update a user's role. Restricted via Next.js middleware."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.role = role_data.role
    db.commit()
    db.refresh(user)
    return user
