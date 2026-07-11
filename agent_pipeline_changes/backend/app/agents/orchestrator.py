import time

from sqlalchemy.orm import Session

from app.agents.data_agent import DataAgent
from app.agents.monitoring_agent import MonitoringAgent
from app.agents.recommendation_agent import RecommendationAgent
from app.agents.decision_agent import DecisionAgent


class Orchestrator:
    """
    Runs the fixed agent sequence:
        DataAgent -> MonitoringAgent -> RecommendationAgent -> DecisionAgent

    Each agent reads/writes a shared 'blackboard' dict rather than
    calling each other directly. This is the Blackboard architectural
    pattern: it keeps agents decoupled, so new agents (e.g. a future
    PricingAgent or RerouteAgent) can be inserted into the sequence
    without changing any existing agent's code — only the pipeline
    list below changes.

    This orchestrator is deliberately synchronous and rule-based
    (no LLM calls). It's the scaffold the platform is designed to
    extend into full autonomous, model-driven decision-making —
    each agent's run() method is the seam where an LLM call or
    external model would slot in later.
    """

    def __init__(self, db: Session):
        self.db = db
        self.pipeline = [
            DataAgent(db),
            MonitoringAgent(),
            RecommendationAgent(db),
            DecisionAgent(),
        ]

    def run(self, vehicle_id: int) -> dict:
        context = {"vehicle_id": vehicle_id}
        trace = []

        pipeline_start = time.perf_counter()

        for agent in self.pipeline:
            result = agent._timed_run(context)
            trace.append(result.to_dict())

            # Fail fast if the vehicle doesn't exist — no point running
            # downstream agents against an empty context.
            if agent.name == "DataAgent" and context.get("vehicle") is None:
                break

        total_ms = round((time.perf_counter() - pipeline_start) * 1000, 3)

        return {
            "vehicle_id": vehicle_id,
            "trace": trace,
            "final_decision": context.get("decision", "Pipeline halted before a decision was reached."),
            "action_code": context.get("action_code", "HALTED"),
            "flags": context.get("flags", []),
            "total_duration_ms": total_ms,
        }
