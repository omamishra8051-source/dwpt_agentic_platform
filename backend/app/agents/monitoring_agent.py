from app.agents.base import BaseAgent, AgentResult

LOW_SOC_THRESHOLD = 30


class MonitoringAgent(BaseAgent):
    """
    Inspects the state loaded by DataAgent and raises flags for
    conditions that matter to the fleet: low charge, missing highway
    assignment, missing station assignment. Flags are written to the
    blackboard so DecisionAgent can turn them into a human-readable
    verdict without re-deriving them.
    """

    name = "MonitoringAgent"

    def run(self, context: dict) -> AgentResult:
        vehicle = context.get("vehicle")

        if vehicle is None:
            context["flags"] = ["VEHICLE_NOT_FOUND"]
            return AgentResult(
                agent_name=self.name,
                summary="Vehicle not found — no state to monitor.",
                output={"flags": ["VEHICLE_NOT_FOUND"]},
                duration_ms=0,
            )

        flags = []

        if vehicle.soc < LOW_SOC_THRESHOLD:
            flags.append("LOW_SOC")

        if not vehicle.highway_id:
            flags.append("UNASSIGNED_HIGHWAY")

        if vehicle.highway_id and not vehicle.charging_station_id:
            flags.append("NO_STATION_ASSIGNED")

        if vehicle.target_soc is not None and vehicle.target_soc <= vehicle.soc:
            flags.append("TARGET_ALREADY_MET")

        context["flags"] = flags

        summary = (
            f"Raised {len(flags)} flag(s): {', '.join(flags)}."
            if flags
            else "No anomalies detected — vehicle state is nominal."
        )

        return AgentResult(
            agent_name=self.name,
            summary=summary,
            output={"flags": flags, "soc": vehicle.soc, "threshold": LOW_SOC_THRESHOLD},
            duration_ms=0,
        )