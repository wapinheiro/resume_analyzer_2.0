from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.api import deps
from app.models.user import User
from app.schemas.user import UserCreate, User as UserSchema, UserLogin, UserRoleUpdate, UserProfileUpdate
from app.schemas.analysis import Analysis as AnalysisSchema
from app.models.analysis import Analysis
from app.models.resume import Resume

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
    if not user:
        user = User(
            email=user_in.email,
            name=user_in.name,
            avatar_url=user_in.avatar_url,
            role="student",
            last_login=datetime.utcnow()
        )
        db.add(user)
    else:
        user.name = user_in.name or user.name
        user.avatar_url = user_in.avatar_url or user.avatar_url
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

@router.get("/me/analyses", response_model=List[AnalysisSchema])
def get_my_analyses(
    db: Session = Depends(deps.get_db),
    current_user_id: str = Depends(deps.get_current_user_id)
):
    """
    Returns all analyses for the current authenticated student.
    """
    from uuid import UUID
    user_uuid = UUID(current_user_id)
    
    # Get all resumes for this user, then all analyses for those resumes
    resumes = db.query(Resume).filter(Resume.user_id == user_uuid).all()
    resume_ids = [r.id for r in resumes]
    
    analyses = db.query(Analysis).filter(Analysis.resume_id.in_(resume_ids)).order_by(Analysis.created_at.desc()).all()
    return analyses

@router.patch("/me/profile", response_model=UserSchema)
def update_my_profile(
    profile_data: UserProfileUpdate,
    db: Session = Depends(deps.get_db),
    current_user_id: str = Depends(deps.get_current_user_id)
):
    """Update the current user's profile information."""
    from uuid import UUID
    user_uuid = UUID(current_user_id)
    
    user = db.query(User).filter(User.id == user_uuid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if profile_data.major is not None:
        user.major = profile_data.major
    if profile_data.graduation_year is not None:
        user.graduation_year = profile_data.graduation_year
    if profile_data.student_status is not None:
        user.student_status = profile_data.student_status
    
    db.commit()
    db.refresh(user)
    return user
