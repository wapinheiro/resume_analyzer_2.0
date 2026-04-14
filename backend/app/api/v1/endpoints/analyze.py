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
            yield json.dumps({"type": "log", "message": "Fetching market requirements..."}) + "\n"
            
            # Fetch Market Reference Skills
            from app.models.market_skill import MarketSkill
            market_skills = db.query(MarketSkill).all()
            
            market_ref_str = ""
            if market_skills:
                market_ref_str = "\nMARKET REFERENCE SKILLS (2026 High-Signal):\n"
                for s in market_skills:
                    major_info = f" ({s.major})" if s.major else ""
                    market_ref_str += f"- {s.name}: {s.category}{major_info} (Importance: {s.importance}/5)\n"
            
            yield json.dumps({"type": "log", "message": "AI analyzing profile & key skills..."}) + "\n"
            
            # Initialize Gemini
            gemini = services.GeminiService()
            
            if gemini.model:
                # Inject market reference into prompt
                analysis_data = await gemini.analyze_resume(text, market_ref_str=market_ref_str)
                
                # Create Analysis Record
                db_analysis = models.Analysis(
                    resume_id=db_resume.id,
                    rms_score=analysis_data.get("rms_score", 0),
                    cpi=analysis_data.get("cpi", "Unknown"),
                    confidence_score=analysis_data.get("confidence_score"),
                    confidence_reasoning=analysis_data.get("confidence_reasoning"),
                    predicted_grad_date=analysis_data.get("predicted_grad_date"),
                    major=analysis_data.get("major"),
                    skills_detected=analysis_data.get("skills_detected", []),
                    skills_gaps=analysis_data.get("skills_gaps", []),
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
                    major="Computer Science",
                    skills_detected=["Python", "React", "FastAPI"],
                    skills_gaps=["RAG", "Kubernetes"],
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

@router.get("/{analysis_id}", response_model=schemas.Analysis)
def get_analysis_details(
    analysis_id: str,
    db: Session = Depends(deps.get_db),
    current_user_id: str = Depends(deps.get_current_user_id)
):
    """
    Returns the details of a specific analysis.
    Ensures ownership: users can only see their own analyses unless they are an advisor/admin.
    """
    try:
        analysis_uuid = uuid.UUID(analysis_id)
        user_uuid = uuid.UUID(current_user_id)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    analysis = db.query(models.Analysis).filter(models.Analysis.id == analysis_uuid).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    # Check ownership
    # We need the resume to get the user_id
    resume = db.query(models.Resume).filter(models.Resume.id == analysis.resume_id).first()
    
    # Check if user is the owner
    if resume.user_id != user_uuid:
        # Check if user is an advisor/admin
        # We could use another dependency but let's just check the DB here for simplicity
        from app.models.user import User
        requester = db.query(User).filter(User.id == user_uuid).first()
        if not requester or requester.role not in ["advisor", "admin"]:
            raise HTTPException(status_code=403, detail="Not authorized to view this analysis")

    return analysis

from fastapi import Response

@router.get("/{analysis_id}/resume")
def get_resume_link(
    analysis_id: str,
    db: Session = Depends(deps.get_db),
    current_user_id: str = Depends(deps.get_current_user_id)
):
    """
    Returns the resume PDF associated with an analysis.
    Ensures ownership: users can only see their own resumes unless they are an advisor/admin.
    """
    try:
        analysis_uuid = uuid.UUID(analysis_id)
        user_uuid = uuid.UUID(current_user_id)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    analysis = db.query(models.Analysis).filter(models.Analysis.id == analysis_uuid).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    resume = db.query(models.Resume).filter(models.Resume.id == analysis.resume_id).first()
    if not resume:
         raise HTTPException(status_code=404, detail="Resume not found")

    # Check ownership
    is_authorized = False
    if resume.user_id == user_uuid:
        is_authorized = True
    else:
        # Check if user is an advisor/admin
        from app.models.user import User
        requester = db.query(User).filter(User.id == user_uuid).first()
        if requester and requester.role in ["advisor", "admin"]:
            is_authorized = True

    if not is_authorized:
        raise HTTPException(status_code=403, detail="Not authorized to view this resume")

    # Get GCS blob name
    gcs_blob = None
    if resume.client_info:
        if isinstance(resume.client_info, dict):
            gcs_blob = resume.client_info.get("gcs_blob")
        elif isinstance(resume.client_info, str):
            try:
                import json
                c_info = json.loads(resume.client_info)
                gcs_blob = c_info.get("gcs_blob")
            except:
                pass

    if not gcs_blob:
        raise HTTPException(status_code=404, detail="Resume file not found in storage")

    # Proxy the file bytes
    try:
        pdf_bytes = services.gcs_service.download_file(gcs_blob)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"inline; filename={gcs_blob.split('/')[-1]}"
            }
        )
    except Exception as e:
        print(f"Proxy Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch file from storage")
