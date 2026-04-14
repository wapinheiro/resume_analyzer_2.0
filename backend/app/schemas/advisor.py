from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class AdvisorStudentSub(BaseModel):
    id: str
    name: Optional[str] = None
    email: str
    last_scan_date: Optional[datetime] = None
    latest_score: Optional[int] = None
    status: str = "Pending"  # Current UI field
    student_status: str = "active_student" # New DB field
    major: Optional[str] = None
    grad_year: Optional[int] = None

class AdvisorStudentListResponse(BaseModel):
    students: List[AdvisorStudentSub]
    total_count: int
    page: int
    page_size: int

class AdvisorAnalyticsOverview(BaseModel):
    average_score: float
    total_scans_30d: int
    top_missing_skill: Optional[str] = None
    top_detected_skill: Optional[str] = None

class ScoreDataPoint(BaseModel):
    date: str  # YYYY-MM or YYYY-MM-DD
    average_score: float
    count: int

class AdvisorScoreTrendResponse(BaseModel):
    data: List[ScoreDataPoint]
    insight: str

class VolumeDataPoint(BaseModel):
    period: str # e.g., "2026-01-01" or "Week 3"
    scan_count: int

class AdvisorVolumeResponse(BaseModel):
    data: List[VolumeDataPoint]
    group_by: str

class SkillGapData(BaseModel):
    skill: str
    missing_count: int
    percentage: float

class AdvisorSkillsResponse(BaseModel):
    data: List[SkillGapData]

class AdvisorFilterOptions(BaseModel):
    majors: List[str]
    grad_years: List[int]
    student_statuses: List[str]
