import uuid
from typing import Any, Optional
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from app import schemas, models, services
from app.api import deps

router = APIRouter()

import json
import asyncio
from fastapi.responses import StreamingResponse
from fastapi.encoders import jsonable_encoder

@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    user_id: Optional[str] = Depends(deps.get_optional_user_id)
):
    """
    Analyze a resume PDF with Real-Time Streaming Feedback.
    Returns a stream of JSON chunks:
    {"type": "log", "message": "..."}
    {"type": "result", "data": {...}}
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF")

    # Read file content into memory immediately to prevent FastAPI from closing it
    # when the request handler returns the StreamingResponse.
    file_content = await file.read()
    file_name = file.filename
    content_type = file.content_type
    
    async def event_generator():
        try:
            # 1. Upload to GCS
            yield json.dumps({"type": "log", "message": "Uploading to Secure Cloud Storage..."}) + "\n"
            
            gcs_filename = f"{uuid.uuid4()}/{file_name}"
            
            # Use BytesIO for GCS upload
            import io
            file_obj_gcs = io.BytesIO(file_content)
            public_url = await services.gcs_service.upload_file(file_obj_gcs, gcs_filename, content_type)
            
            # 2. Extract Text
            yield json.dumps({"type": "log", "message": "Extracting text from PDF..."}) + "\n"
            
            # Use new BytesIO for extraction (fresh cursor)
            file_obj_pdf = io.BytesIO(file_content)
            text = await services.extract_text_from_pdf(file_obj_pdf)
            
            # 3. Create Resume Record
            session_id = uuid.uuid4()
            client_info = {
                "filename": file_name, 
                "content_type": content_type,
                "gcs_uri": public_url,
                "gcs_blob": gcs_filename
            }
            db_user_id = None
            if user_id:
                client_info["user_id"] = user_id
                db_user_id = uuid.UUID(user_id)

            db_resume = models.Resume(
                session_id=session_id, 
                client_info=client_info,
                user_id=db_user_id
            )
            db.add(db_resume)
            db.commit()
            db.refresh(db_resume)

            # 4. Analyze with AI
            yield json.dumps({"type": "log", "message": "AI analyzing profile & key skills..."}) + "\n"
            
            # Initialize Gemini
            gemini = services.GeminiService()
            
            if gemini.model:
                # We can yield a "Retrying" message if we catch the retry in a callback, 
                # but for now we'll just yield the "Analyzing" state.
                # If it takes long, we could potentially yield "Still thinking..." strings via a background task,
                # but simple linear logs are a good start.
                analysis_data = await gemini.analyze_resume(text)
                
                # Create Analysis Record
                db_analysis = models.Analysis(
                    resume_id=db_resume.id,
                    rms_score=analysis_data.get("rms_score", 0),
                    cpi=analysis_data.get("cpi", "Unknown"),
                    predicted_grad_date=analysis_data.get("predicted_grad_date"),
                    skills_detected=analysis_data.get("skills_detected", []),
                    top_risks=analysis_data.get("top_risks", []),
                    raw_json=analysis_data
                )
            else:
                # Mock Fallback
                yield json.dumps({"type": "log", "message": "Using Mock AI Service..."}) + "\n"
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
                    top_risks=[{"type": "Weak Verbs", "issue": "Used 'Helped' instead of 'Architected'"}, {"type": "Missing Metrics", "issue": "No quantifiable impact"}],
                    raw_json={"layers": mock_layers}
                )

            # 5. Finalize
            db.add(db_analysis)
            db.commit()
            db.refresh(db_analysis)
            
            yield json.dumps({"type": "log", "message": "Finalizing Report..."}) + "\n"
            
            # 6. Return Result
            # Convert SQLAlchemy model to Pydantic and then to JSON-friendly dict
            result_schema = schemas.Analysis.from_orm(db_analysis)
            serialized_data = jsonable_encoder(result_schema)
            yield json.dumps({"type": "result", "data": serialized_data}) + "\n"

        except Exception as e:
            print(f"Stream Error: {e}")
            yield json.dumps({"type": "error", "message": str(e)}) + "\n"

    return StreamingResponse(event_generator(), media_type="application/x-ndjson")
