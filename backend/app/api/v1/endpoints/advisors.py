from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from typing import List, Optional
from datetime import datetime, timedelta

from app.api import deps
from app.models.user import User
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.models.market_skill import MarketSkill
from app.schemas import advisor as schemas
from app.schemas import market_skill as skill_schemas

router = APIRouter()

# --- Market Skills Management (CRUD) ---

@router.get("/market-skills", response_model=List[skill_schemas.MarketSkill])
def list_market_skills(
    db: Session = Depends(deps.get_db),
    advisor_id: str = Depends(deps.get_current_advisor)
):
    """List all canonical market skills."""
    return db.query(MarketSkill).order_by(MarketSkill.name).all()

@router.post("/market-skills", response_model=skill_schemas.MarketSkill)
def create_market_skill(
    skill: skill_schemas.MarketSkillCreate,
    db: Session = Depends(deps.get_db),
    advisor_id: str = Depends(deps.get_current_advisor)
):
    """Add a new canonical skill to the reference dataset."""
    db_skill = MarketSkill(**skill.model_dump())
    db.add(db_skill)
    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=400, detail="Skill already exists or invalid data")
    db.refresh(db_skill)
    return db_skill

@router.patch("/market-skills/{skill_id}", response_model=skill_schemas.MarketSkill)
def update_market_skill(
    skill_id: str,
    skill_update: skill_schemas.MarketSkillUpdate,
    db: Session = Depends(deps.get_db),
    advisor_id: str = Depends(deps.get_current_advisor)
):
    """Update an existing canonical skill."""
    import uuid
    try:
        skill_uuid = uuid.UUID(skill_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Skill ID")

    db_skill = db.query(MarketSkill).filter(MarketSkill.id == skill_uuid).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    update_data = skill_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_skill, key, value)
    
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.delete("/market-skills/{skill_id}")
def delete_market_skill(
    skill_id: str,
    db: Session = Depends(deps.get_db),
    advisor_id: str = Depends(deps.get_current_advisor)
):
    """Remove a skill from the reference dataset."""
    import uuid
    try:
        skill_uuid = uuid.UUID(skill_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Skill ID")

    db_skill = db.query(MarketSkill).filter(MarketSkill.id == skill_uuid).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    db.delete(db_skill)
    db.commit()
    return {"message": "Skill deleted successfully"}

# --- Analytics & Dashboard ---

@router.get("/filter-options", response_model=schemas.AdvisorFilterOptions)
def get_filter_options(
    db: Session = Depends(deps.get_db),
    advisor_id: str = Depends(deps.get_current_advisor)
):
    """
    Returns distinct values for majors, graduation years, and student statuses
    currently present in the User table for students.
    """
    majors = db.query(User.major).filter(User.role == "student", User.major != None).distinct().all()
    grad_years = db.query(User.graduation_year).filter(User.role == "student", User.graduation_year != None).distinct().all()
    statuses = db.query(User.student_status).filter(User.role == "student", User.student_status != None).distinct().all()

    return {
        "majors": sorted([m[0] for m in majors]),
        "grad_years": sorted([y[0] for y in grad_years]),
        "student_statuses": sorted([s[0] for s in statuses])
    }

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
    
    # 3. Top Detected Skill (Strengths)
    strength_query = """
    SELECT skill FROM (
        SELECT json_array_elements_text(skills_detected) AS skill FROM analyses WHERE skills_detected IS NOT NULL
    ) AS subq GROUP BY skill ORDER BY COUNT(*) DESC LIMIT 1;
    """
    strength_result = db.execute(text(strength_query)).scalar()
    
    # 4. Top Missing Skill (Gaps)
    gap_query = """
    SELECT skill FROM (
        SELECT json_array_elements_text(skills_gaps) AS skill FROM analyses WHERE skills_gaps IS NOT NULL
    ) AS subq GROUP BY skill ORDER BY COUNT(*) DESC LIMIT 1;
    """
    gap_result = db.execute(text(gap_query)).scalar()
    
    return {
        "average_score": float(avg_score or 0.0),
        "total_scans_30d": total_scans_30d,
        "top_missing_skill": gap_result if gap_result else "None Detected",
        "top_detected_skill": strength_result if strength_result else "None Detected"
    }

@router.get("/students", response_model=schemas.AdvisorStudentListResponse)
def list_students(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    major: Optional[str] = None,
    graduation_year: Optional[int] = None,
    student_status: Optional[str] = "active_student",
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
    
    if major:
        query = query.filter(User.major == major)
    
    if graduation_year:
        query = query.filter(User.graduation_year == graduation_year)
        
    if student_status and student_status != "all":
        query = query.filter(User.student_status == student_status)
        
    total_count = query.count()
    users = query.offset(skip).limit(limit).all()
    
    # For each user, fetch their latest analysis (N+1 query issue here, but fine for MVP)
    student_data = []
    for user in users:
        # Get latest resume for this user
        latest_resume = db.query(Resume).filter(Resume.user_id == user.id).order_by(Resume.uploaded_at.desc()).first()
        latest_analysis = None
        major = None
        grad_year = None
        if latest_resume:
             latest_analysis = db.query(Analysis).filter(Analysis.resume_id == latest_resume.id).order_by(Analysis.created_at.desc()).first()
             if latest_resume.client_info:
                 import json
                 c_info = latest_resume.client_info
                 if isinstance(c_info, str):
                     try:
                         c_info = json.loads(c_info)
                     except Exception:
                         c_info = {}
                 
                 major = c_info.get("major") if isinstance(c_info, dict) else None
                 grad_year = c_info.get("grad_year") if isinstance(c_info, dict) else None
                 
        student_data.append(schemas.AdvisorStudentSub(
            id=str(user.id),
            name=user.name,
            email=user.email,
            last_scan_date=latest_analysis.created_at if latest_analysis else None,
            latest_score=latest_analysis.rms_score if latest_analysis else None,
            status="Reviewed" if latest_analysis else "Pending",
            student_status=user.student_status,
            major=user.major,
            grad_year=user.graduation_year
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
    Uses PostgreSQL TO_CHAR to group by month.
    """
    query = """
    SELECT TO_CHAR(created_at, 'YYYY-MM') AS date, 
           AVG(rms_score) AS average_score, 
           COUNT(*) AS count 
    FROM analyses 
    WHERE created_at >= NOW() - INTERVAL '6 months' 
    GROUP BY date ORDER BY date ASC;
    """
    results = db.execute(text(query)).fetchall()
    
    data = []
    for row in results:
        data.append({"date": row[0], "average_score": round(row[1], 1) if row[1] else 0, "count": row[2]})

    insight = "Scores are calculated from the last 6 months of historical data."
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
    Returns histogram data of total scans for the volume chart using PostgreSQL.
    """
    query_str = """
    SELECT TO_CHAR(created_at, 'YYYY-MM') AS period, 
           COUNT(*) AS scan_count 
    FROM analyses 
    WHERE created_at >= NOW() - INTERVAL '6 months' 
    GROUP BY period ORDER BY period ASC;
    """
    results = db.execute(text(query_str)).fetchall()
    
    data = []
    for row in results:
        data.append({"period": row[0], "scan_count": row[1]})
        
    return {"data": data, "group_by": group_by}

@router.get("/analytics/skills", response_model=schemas.AdvisorSkillsResponse)
def get_skills_distribution(
    type: str = Query("gaps", regex="^(strengths|gaps)$"),
    major: Optional[str] = None,
    grad_year: Optional[int] = None,
    db: Session = Depends(deps.get_db),
    advisor_id: str = Depends(deps.get_current_advisor)
):
    """
    Returns a frequency map of either identified strengths or detected gaps.
    """
    target_column = "skills_detected" if type == "strengths" else "skills_gaps"
    
    query = f"""
    SELECT skill, COUNT(*) as count
    FROM (
        SELECT json_array_elements_text({target_column}) AS skill 
        FROM analyses 
        WHERE {target_column} IS NOT NULL
    ) AS subq
    GROUP BY skill 
    ORDER BY count DESC 
    LIMIT 10;
    """
    results = db.execute(text(query)).fetchall()
    
    data = []
    total = sum(row[1] for row in results) if results else 1
    for row in results:
        data.append({
            "skill": row[0], 
            "missing_count": row[1], 
            "percentage": round((row[1] / total) * 100, 1) if total > 0 else 0
        })
        
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
    
    from sqlalchemy.orm import joinedload
    analyses = db.query(Analysis)\
        .filter(Analysis.resume_id.in_(resume_ids))\
        .options(joinedload(Analysis.resume).joinedload(Resume.user))\
        .order_by(Analysis.created_at.desc())\
        .all()
    
    return analyses
