from fastapi import APIRouter

from app.api.v1.endpoints import analyze, users, advisors

api_router = APIRouter()
api_router.include_router(analyze.router, prefix="/analyze", tags=["analyze"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(advisors.router, prefix="/advisors", tags=["advisors"])
