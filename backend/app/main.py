from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import vehicles

app = FastAPI(
    title="DWPT Agentic Platform API",
    description="Backend API for the Dynamic Wired Power Transfer simulation platform.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vehicles.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to the DWPT Agentic Platform API",
        "status": "running"
    }