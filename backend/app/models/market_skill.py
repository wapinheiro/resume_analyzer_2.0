import uuid
from sqlalchemy import String, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base

class MarketSkill(Base):
    __tablename__ = "market_skills"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, index=True, unique=True)
    category: Mapped[str] = mapped_column(String, index=True)
    major: Mapped[str] = mapped_column(String, nullable=True, index=True)
    importance: Mapped[int] = mapped_column(Integer, default=3) # 1-5 scale
