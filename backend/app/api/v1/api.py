from fastapi import APIRouter
from app.api.v1.endpoints import analyze, users

api_router = APIRouter()
api_router.include_router(analyze.router, prefix="/resumes", tags=["resumes"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
