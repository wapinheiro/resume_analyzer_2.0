from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta

from app.api import deps
from app.models.user import User
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.schemas import advisor as schemas

router = APIRouter()

@router.get("/analytics", response_model=schemas.AdvisorAnalyticsOverview)
def get_analytics_overview(
    db: Session = Depends(deps.get_db),
    advisor_id: str = Depends(deps.get_current_advisor)
):
    """
    Returns top-level aggregate metrics for the dashboard.
    """
    # 1. Average Score (all time for simplicity, or we could scope to 30d)
    avg_score = db.query(func.avg(Analysis.rms_score)).scalar()
    
    # 2. Total Scans (Last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    total_scans_30d = db.query(Analysis).filter(Analysis.created_at >= thirty_days_ago).count()
    
    # 3. Top Missing Skill (Stubbed out until we parse JSON layers in DB)
    top_missing_skill = "System Design" 
    
    return {
        "average_score": float(avg_score or 0.0),
        "total_scans_30d": total_scans_30d,
        "top_missing_skill": top_missing_skill
    }

@router.get("/students", response_model=schemas.AdvisorStudentListResponse)
def list_students(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(deps.get_db),
    advisor_id: str = Depends(deps.get_current_advisor)
):
    """
    Returns a paginated list of all students with their latest scan data.
    """
    query = db.query(User).filter(User.role == "student")
    
    if search:
        query = query.filter(
            (User.email.ilike(f"%{search}%")) | (User.name.ilike(f"%{search}%"))
        )
        
    total_count = query.count()
    users = query.offset(skip).limit(limit).all()
    
    # For each user, fetch their latest analysis (N+1 query issue here, but fine for MVP)
    student_data = []
    for user in users:
        # Get latest resume for this user
        latest_resume = db.query(Resume).filter(Resume.user_id == user.id).order_by(Resume.uploaded_at.desc()).first()
        latest_analysis = None
        if latest_resume:
             latest_analysis = db.query(Analysis).filter(Analysis.resume_id == latest_resume.id).order_by(Analysis.created_at.desc()).first()
             
        student_data.append(schemas.AdvisorStudentSub(
            id=str(user.id),
            name=user.name,
            email=user.email,
            last_scan_date=latest_analysis.created_at if latest_analysis else None,
            latest_score=latest_analysis.rms_score if latest_analysis else None,
            status="Pending" # Stub status
        ))
        
    return {
        "students": student_data,
        "total_count": total_count,
        "page": skip // limit + 1,
        "page_size": limit
    }

@router.get("/analytics/scores", response_model=schemas.AdvisorScoreTrendResponse)
def get_score_evolution(
    major: Optional[str] = None,
    grad_year: Optional[int] = None,
    db: Session = Depends(deps.get_db),
    advisor_id: str = Depends(deps.get_current_advisor)
):
    """
    Returns time-series data of average RMS scores for the evolution chart.
    TODO: Implement filtering and correct time grouping (SQLite date functions).
    """
    # Stubbed data for Phase 2 frontend development
    data = [
        {"date": "2025-09", "average_score": 65.2, "count": 12},
        {"date": "2025-10", "average_score": 70.1, "count": 45},
        {"date": "2025-11", "average_score": 72.8, "count": 32},
        {"date": "2025-12", "average_score": 71.0, "count": 15},
        {"date": "2026-01", "average_score": 75.4, "count": 89},
        {"date": "2026-02", "average_score": 82.1, "count": 41},
    ]
    insight = "Scores are trending upwards, with a significant spike in January likely due to Winter Career Fair preparation."
    return {"data": data, "insight": insight}

@router.get("/analytics/volume", response_model=schemas.AdvisorVolumeResponse)
def get_scan_volume(
    group_by: str = Query("month", regex="^(day|week|month|semester)$"),
    major: Optional[str] = None,
    grad_year: Optional[int] = None,
    db: Session = Depends(deps.get_db),
    advisor_id: str = Depends(deps.get_current_advisor)
):
    """
    Returns histogram data of total scans for the volume chart.
    TODO: Implement real SQL aggregations.
    """
    # Stubbed data 
    data = [
        {"period": "2025-09", "scan_count": 120},
        {"period": "2025-10", "scan_count": 350},
        {"period": "2025-11", "scan_count": 210},
        {"period": "2025-12", "scan_count": 95},
        {"period": "2026-01", "scan_count": 680},
        {"period": "2026-02", "scan_count": 420},
    ]
    return {"data": data, "group_by": group_by}

@router.get("/analytics/skills", response_model=schemas.AdvisorSkillsResponse)
def get_skills_gap(
    major: Optional[str] = None,
    grad_year: Optional[int] = None,
    db: Session = Depends(deps.get_db),
    advisor_id: str = Depends(deps.get_current_advisor)
):
    """
    Returns a frequency map of the most identified missing skills.
    TODO: Implement JSON extraction from the Analysis table layers.
    """
    # Stubbed data representing "System Design", "Docker", etc.
    data = [
        {"skill": "System Design", "missing_count": 142, "percentage": 42.5},
        {"skill": "Docker", "missing_count": 120, "percentage": 35.9},
        {"skill": "Python", "missing_count": 89, "percentage": 26.6},
        {"skill": "CI/CD", "missing_count": 65, "percentage": 19.4},
        {"skill": "React", "missing_count": 52, "percentage": 15.5},
    ]
    return {"data": data}

@router.get("/students/{user_id}/analyses")
def get_student_analyses(
    user_id: str,
    db: Session = Depends(deps.get_db),
    advisor_id: str = Depends(deps.get_current_advisor)
):
    """
    Returns the analysis history for a specific student.
    """
    import uuid
    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid student ID format")

    # Verify the user exists and is a student
    student = db.query(User).filter(User.id == user_uuid, User.role == "student").first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    resumes = db.query(Resume).filter(Resume.user_id == user_uuid).all()
    resume_ids = [r.id for r in resumes]
    
    analyses = db.query(Analysis).filter(Analysis.resume_id.in_(resume_ids)).order_by(Analysis.created_at.desc()).all()
    
    # We can just return the raw SQLAlchemy models, FastAPI will serialize them
    return analyses
