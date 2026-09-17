from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.deps import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.analysis import Analysis

router = APIRouter()

# Default High Score Entries for Initial Launch / Padding
DEFAULT_MOCK_LEADERBOARD = [
    {"rank": 1, "score": 99, "name": "Wagner Pinheiro", "major": "Computer Science", "badge": "MARKET READY", "year": "Senior"},
    {"rank": 2, "score": 97, "name": "Ryan Richards", "major": "Computer Science", "badge": "MARKET READY", "year": "Junior"},
    {"rank": 3, "score": 96, "name": "James Teuscher", "major": "Cybersecurity", "badge": "MARKET READY", "year": "Senior"},
    {"rank": 4, "score": 95, "name": "Sarah Kim", "major": "Data Science", "badge": "INTERN READY", "year": "Sophomore"},
    {"rank": 5, "score": 94, "name": "Tyler Bennett", "major": "Computer Science", "badge": "INTERN READY", "year": "Senior"},
    {"rank": 6, "score": 93, "name": "Michael Miller", "major": "Computer Science", "badge": "INTERN READY", "year": "Junior"},
    {"rank": 7, "score": 92, "name": "Will Johnson", "major": "Cybersecurity", "badge": "INTERN READY", "year": "Senior"},
    {"rank": 8, "score": 91, "name": "Steven Vance", "major": "Data Science", "badge": "INTERN READY", "year": "Freshman"},
    {"rank": 9, "score": 90, "name": "William Hostettler", "major": "Computer Science", "badge": "INTERN READY", "year": "Senior"},
    {"rank": 10, "score": 89, "name": "Taylor Reynolds", "major": "Computer Science", "badge": "TOURIST", "year": "Junior"},
]

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

    # If DB rows are fewer than limit, supplement with fallback high score entries
    if len(leaderboard_results) < limit:
        filtered_defaults = [
            d for d in DEFAULT_MOCK_LEADERBOARD
            if major == "ALL" or
               (major == "CS" and d["major"] == "Computer Science") or
               (major == "CYBER" and d["major"] == "Cybersecurity") or
               (major == "DS" and d["major"] == "Data Science")
        ]
        
        existing_names = {r["name"] for r in leaderboard_results}
        for d in filtered_defaults:
            if len(leaderboard_results) >= limit:
                break
            if d["name"] not in existing_names:
                d_copy = dict(d)
                d_copy["rank"] = len(leaderboard_results) + 1
                leaderboard_results.append(d_copy)

    return {
        "major_filter": major,
        "total_returned": len(leaderboard_results),
        "leaderboard": leaderboard_results
    }
