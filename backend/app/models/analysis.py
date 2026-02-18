from datetime import datetime
import uuid
from sqlalchemy import DateTime, Integer, String, ForeignKey, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("resumes.id"))
    
    # Analytics Metrics
    rms_score: Mapped[int] = mapped_column(Integer, nullable=True)
    cpi: Mapped[str] = mapped_column(String, nullable=True)
    predicted_grad_date: Mapped[str] = mapped_column(String, nullable=True)
    
    # JSON Data
    skills_detected: Mapped[list] = mapped_column(JSON, nullable=True)
    top_risks: Mapped[list] = mapped_column(JSON, nullable=True)
    raw_json: Mapped[dict] = mapped_column(JSON, nullable=True) # Full analysis result
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    resume = relationship("Resume", back_populates="analyses")
