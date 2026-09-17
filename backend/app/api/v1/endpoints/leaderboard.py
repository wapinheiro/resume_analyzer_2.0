from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.deps import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.analysis import Analysis

router = APIRouter()

def format_badge(rms_score: int) -> str:
    if rms_score >= 90:
        return "MARKET READY"
    elif rms_score >= 75:
        return "INTERN READY"
    else:
        return "TOURIST"

def format_year(grad_year: Optional[int]) -> str:
    if not grad_year:
        return "Student"
    current_year = 2026
    diff = grad_year - current_year
    if diff <= 0:
        return "Senior"
    elif diff == 1:
        return "Junior"
    elif diff == 2:
        return "Sophomore"
    else:
        return "Freshman"

@router.get("")
def get_leaderboard(
    major: str = Query("ALL", regex="^(ALL|CS|CYBER|DS)$"),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """
    Returns the top N active BYU CS students ranked by highest RMS Resume Marketability Score.
    """
    leaderboard_results = []
    
    try:
        # Subquery to find max rms_score per user
        max_score_subquery = (
            db.query(
                Resume.user_id.label("user_id"),
                func.max(Analysis.rms_score).label("max_rms")
            )
            .join(Analysis, Analysis.resume_id == Resume.id)
            .filter(Resume.user_id.isnot(None))
            .group_by(Resume.user_id)
            .subquery()
        )

        # Query top users
        query = (
            db.query(User, max_score_subquery.c.max_rms)
            .join(max_score_subquery, User.id == max_score_subquery.c.user_id)
            .filter(User.role == "student")
            .filter(User.leaderboard_opt_in == True)
        )

        # Apply Major Filtering
        if major == "CS":
            query = query.filter(User.major.ilike("%Computer Science%"))
        elif major == "CYBER":
            query = query.filter(User.major.ilike("%Cybersecurity%"))
        elif major == "DS":
            query = query.filter(User.major.ilike("%Data Science%"))

        db_rows = query.order_by(max_score_subquery.c.max_rms.desc()).limit(limit).all()

        for idx, (user, max_rms) in enumerate(db_rows, start=1):
            name_parts = (user.name or "BYU Student").split()
            formatted_name = user.name if len(name_parts) <= 1 else f"{name_parts[0]} {name_parts[-1][0]}."
            
            leaderboard_results.append({
                "rank": idx,
                "score": max_rms,
                "name": formatted_name,
                "major": user.major or "Computer Science",
                "badge": format_badge(max_rms),
                "year": format_year(user.graduation_year)
            })
    except Exception as e:
        print(f"Error querying leaderboard DB: {e}")

    return {
        "major_filter": major,
        "total_returned": len(leaderboard_results),
        "leaderboard": leaderboard_results
    }

