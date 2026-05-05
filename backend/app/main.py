from fastapi import FastAPI

from app.core.config import settings
from app.lockers.router import router as lockers_router

app = FastAPI(
    title="InPost Smart Finder API",
    description="API for spatial filtering of InPost parcel lockers.",
)

app.include_router(router=lockers_router, prefix=f"{settings.API_V1_STR}/lockers")


@app.get("/")
def health_check():
    return {"status": "ok", "message": "InPost Smart Finder API is running!"}
