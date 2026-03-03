from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.api import deps
from app.models.user import User
from app.schemas.user import UserCreate, User as UserSchema

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
