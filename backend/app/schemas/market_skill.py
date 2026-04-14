import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict

class MarketSkillBase(BaseModel):
    name: str
    category: str
    major: Optional[str] = None
    importance: int = 3

class MarketSkillCreate(MarketSkillBase):
    pass

class MarketSkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    major: Optional[str] = None
    importance: Optional[int] = None

class MarketSkill(MarketSkillBase):
    id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)
