from datetime import datetime
from uuid import UUID
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict

# Shared properties
class AnalysisBase(BaseModel):
    rms_score: Optional[int] = None
    cpi: Optional[str] = None
    predicted_grad_date: Optional[str] = None
    skills_detected: Optional[List[str]] = None
    top_errors: Optional[List[str]] = None
    raw_json: Optional[Dict[str, Any]] = None

# Properties to return to client
class Analysis(AnalysisBase):
    id: UUID
    resume_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
