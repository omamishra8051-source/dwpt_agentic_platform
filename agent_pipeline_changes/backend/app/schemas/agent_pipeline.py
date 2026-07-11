from pydantic import BaseModel


class AgentTraceStep(BaseModel):
    agent: str
    summary: str
    output: dict
    duration_ms: float


class AgentPipelineResponse(BaseModel):
    vehicle_id: int
    trace: list[AgentTraceStep]
    final_decision: str
    action_code: str
    flags: list[str]
    total_duration_ms: float
