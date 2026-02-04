import uuid
from typing import Any
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from app import schemas, models, services
from app.db.session import SessionLocal

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/analyze", response_model=schemas.Analysis)
async def analyze_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
) -> Any:
    """
    Analyze a resume PDF.
    
    1. Uploads file to S3 (Stub)
    2. Creates Resume record
    3. Triggers AI Analysis (Stub: Returns Mock Data)
    4. Saves Analysis record
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    
    # 1. Upload to GCS
    try:
        gcs_filename = f"{uuid.uuid4()}/{file.filename}"
        public_url = await services.gcs_service.upload_file(file.file, gcs_filename, file.content_type)
        
        # Reset file pointer for local extraction
        await file.seek(0)
    except Exception as e:
        print(f"GCS Upload Failed: {e}")
        # Continue with local analysis even if upload fails? 
        # For now, let's log and continue, or fail? 
        # Let's fail if storage is critical, but maybe soft fail for dev?
        # Re-raising for now as storage is 'Phase 4' goal.
        raise HTTPException(status_code=500, detail=f"Storage Error: {str(e)}")

    # 2. Create Resume Record
    session_id = uuid.uuid4() # In real app, get from headers
    db_resume = models.Resume(
        session_id=session_id,
        client_info={
            "filename": file.filename, 
            "content_type": file.content_type,
            "gcs_uri": public_url,
            "gcs_blob": gcs_filename
        }
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    
    # 2. Extract Text & Analyze
    try:
        # Extract Text
        text = await services.extract_text_from_pdf(file)
        
        # Initialize Gemini
        gemini = services.GeminiService()
        
        if gemini.model:
            # REAL AI ANALYSIS
            analysis_data = await gemini.analyze_resume(text)
            
            # Create Analysis Record from AI Data
            db_analysis = models.Analysis(
                resume_id=db_resume.id,
                rms_score=analysis_data.get("rms_score", 0),
                cpi=analysis_data.get("cpi", "Unknown"),
                predicted_grad_date=analysis_data.get("predicted_grad_date"),
                skills_detected=analysis_data.get("skills_detected", []),
                top_errors=analysis_data.get("top_errors", []),
                raw_json=analysis_data # Store full structure including layers
            )
        else:
            # FALLBACK MOCK DATA (If no API Key)
            mock_layers = {
                "format": {"score": 8, "status": "good", "issues": []},
                "impact": {"score": 4, "status": "critical", "issues": [{"type": "Weak Verb", "fix": "Use 'Architected'"}]}
            }
            db_analysis = models.Analysis(
                resume_id=db_resume.id,
                rms_score=62,
                cpi="Full Stack Developer (Mock)",
                predicted_grad_date="May 2026",
                skills_detected=["Python", "React", "FastAPI"],
                top_errors=["Weak Verbs", "Missing Metrics"],
                raw_json={"layers": mock_layers}
            )

        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)
        return db_analysis

    except Exception as e:
        print(f"Analysis failed: {e}")
        # In production, we might want to fail gracefully or return error
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
