from sqlalchemy.orm import Session

from app.agents.base import BaseAgent, AgentResult
from app.services import recommendation_service


class RecommendationAgent(BaseAgent):
    """
    Invokes the same rule-based recommendation engine used by the
    /vehicles/{id}/recommendation endpoint, but only if the vehicle
    has a target SoC and a valid highway+station assignment. Skips
    cleanly (rather than erroring) when those preconditions aren't
    met, since that's a normal state for an idle/unassigned vehicle,
    not a pipeline failure.
    """

    name = "RecommendationAgent"

    def __init__(self, db: Session):
        self.db = db

    def run(self, context: dict) -> AgentResult:
        vehicle = context.get("vehicle")
        flags = context.get("flags", [])

        if vehicle is None:
            context["recommendation"] = None
            return AgentResult(
                agent_name=self.name,
                summary="Skipped — no vehicle in context.",
                output={"skipped": True},
                duration_ms=0,
            )

        if vehicle.target_soc is None:
            context["recommendation"] = None
            return AgentResult(
                agent_name=self.name,
                summary="Skipped — vehicle has no target SoC set.",
                output={"skipped": True, "reason": "no_target_soc"},
                duration_ms=0,
            )

        if "UNASSIGNED_HIGHWAY" in flags or "NO_STATION_ASSIGNED" in flags:
            context["recommendation"] = None
            return AgentResult(
                agent_name=self.name,
                summary="Skipped — vehicle is missing a highway or station assignment.",
                output={"skipped": True, "reason": "incomplete_assignment"},
                duration_ms=0,
            )

        result, error = recommendation_service.calculate_recommendation(
            self.db,
            vehicle.id,
            vehicle.target_soc,
        )

        context["recommendation"] = result
        context["recommendation_error"] = error

        if error:
            return AgentResult(
                agent_name=self.name,
                summary=f"Could not compute recommendation: {error}",
                output={"error": error},
                duration_ms=0,
            )

        return AgentResult(
            agent_name=self.name,
            summary=(
                f"Recommended {result['recommended_speed_kmh']} km/h to reach "
                f"{vehicle.target_soc}% SoC at the assigned station."
            ),
            output=result,
            duration_ms=0,
        )