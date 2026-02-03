from datetime import datetime
from uuid import UUID
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict

# Shared properties
class ResumeBase(BaseModel):
    session_id: Optional[UUID] = None
    client_info: Optional[Dict[str, Any]] = None

# Properties to receive via API on creation
class ResumeCreate(ResumeBase):
    pass

# Properties to return to client
class Resume(ResumeBase):
    id: UUID
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)
