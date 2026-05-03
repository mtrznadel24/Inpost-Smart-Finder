from fastapi import FastAPI

app = FastAPI(
    title="InPost Smart Finder API",
    description="API for spatial filtering of InPost parcel lockers.",
)


@app.get("/")
def health_check():
    return {"status": "ok", "message": "InPost Smart Finder API is running!"}
