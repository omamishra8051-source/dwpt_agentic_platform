from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import vehicles
from app.routers import highways
from app.routers import charging_stations
from app.routers import agents

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DWPT Agentic Platform API",
    description="Backend API for the Dynamic Wired Power Transfer Platform",
    version="1.0.0",
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
app.include_router(highways.router)
app.include_router(charging_stations.router)
app.include_router(agents.router)


@app.get("/")
def root():
    return {
        "message": "DWPT Agentic Platform API",
        "status": "running",
    }