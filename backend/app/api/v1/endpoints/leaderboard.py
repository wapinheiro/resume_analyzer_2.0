import re
from typing import List, Optional
from datetime import datetime
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

def parse_year(grad_year: Optional[int], predicted_grad_date: Optional[str] = None) -> Optional[int]:
    if grad_year:
        return grad_year
    if predicted_grad_date:
        match = re.search(r'\b(20\d{2})\b', str(predicted_grad_date))
        if match:
            try:
                return int(match.group(1))
            except ValueError:
                pass
    return None

def format_year(grad_year: Optional[int], predicted_grad_date: Optional[str] = None) -> str:
    effective_year = parse_year(grad_year, predicted_grad_date)
    if not effective_year:
        return "Unspecified"
    now = datetime.now()
    # Academic year ends in Spring. Starting in August (month >= 8), the graduating Senior class is now.year + 1
    target_senior_year = now.year + (1 if now.month >= 8 else 0)
    diff = effective_year - target_senior_year
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
    Returns the top N active BYU CS students ranked by their latest RMS Resume Marketability Score.
    """
    leaderboard_results = []
    
    try:
        # Subquery to find the latest analysis timestamp per user
        latest_timestamp_subquery = (
            db.query(
                Resume.user_id.label("user_id"),
                func.max(Analysis.created_at).label("latest_created_at")
            )
            .join(Analysis, Analysis.resume_id == Resume.id)
            .filter(Resume.user_id.isnot(None))
            .group_by(Resume.user_id)
            .subquery()
        )

        # Subquery to get the latest analysis score & predicted grad date per user
        latest_score_subquery = (
            db.query(
                Resume.user_id.label("user_id"),
                Analysis.rms_score.label("latest_rms"),
                Analysis.predicted_grad_date.label("latest_predicted_grad_date")
            )
            .join(Analysis, Analysis.resume_id == Resume.id)
            .join(
                latest_timestamp_subquery,
                (Resume.user_id == latest_timestamp_subquery.c.user_id) &
                (Analysis.created_at == latest_timestamp_subquery.c.latest_created_at)
            )
            .subquery()
        )

        # Query top users ranked by latest scan score
        query = (
            db.query(User, latest_score_subquery.c.latest_rms, latest_score_subquery.c.latest_predicted_grad_date)
            .join(latest_score_subquery, User.id == latest_score_subquery.c.user_id)
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

        db_rows = query.order_by(latest_score_subquery.c.latest_rms.desc(), User.name.asc()).limit(limit).all()

        for idx, (user, latest_rms, latest_predicted_grad_date) in enumerate(db_rows, start=1):
            name_parts = (user.name or "BYU Student").split()
            formatted_name = user.name if len(name_parts) <= 1 else f"{name_parts[0]} {name_parts[-1][0]}."
            
            leaderboard_results.append({
                "rank": idx,
                "score": latest_rms,
                "name": formatted_name,
                "major": user.major or "Computer Science",
                "badge": format_badge(latest_rms),
                "year": format_year(user.graduation_year, latest_predicted_grad_date)
            })
    except Exception as e:
        print(f"Error querying leaderboard DB: {e}")

    return {
        "major_filter": major,
        "total_returned": len(leaderboard_results),
        "leaderboard": leaderboard_results
    }

