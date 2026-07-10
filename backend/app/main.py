from fastapi import FastAPI
from app.routers import vehicles

app = FastAPI(
    title="DWPT Agentic Platform API",
    description="Backend API for the Dynamic Wired Power Transfer simulation platform.",
    version="1.0.0"
)

app.include_router(vehicles.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to the DWPT Agentic Platform API",
        "status": "running"
    }