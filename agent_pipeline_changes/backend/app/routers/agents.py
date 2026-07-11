from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.agents.orchestrator import Orchestrator
from app.schemas.agent_pipeline import AgentPipelineResponse

router = APIRouter(
    prefix="/agents",
    tags=["Agents"],
)


@router.post("/run/{vehicle_id}", response_model=AgentPipelineResponse)
def run_agent_pipeline(vehicle_id: int, db: Session = Depends(get_db)):
    orchestrator = Orchestrator(db)
    return orchestrator.run(vehicle_id)
