from app.agents.base import BaseAgent, AgentResult

FLAG_PRIORITY = [
    "VEHICLE_NOT_FOUND",
    "LOW_SOC",
    "UNASSIGNED_HIGHWAY",
    "NO_STATION_ASSIGNED",
    "TARGET_ALREADY_MET",
]

FLAG_MESSAGES = {
    "VEHICLE_NOT_FOUND": "No action possible — vehicle record does not exist.",
    "LOW_SOC": "Charge is critically low. Prioritize routing to the nearest available station.",
    "UNASSIGNED_HIGHWAY": "Vehicle has no highway assignment. Assign a highway before further action.",
    "NO_STATION_ASSIGNED": "Highway assigned but no charging station selected. Assign a station to enable DWPT.",
    "TARGET_ALREADY_MET": "Target SoC already reached. Maintain highway speed limit — no charging action needed.",
}


class DecisionAgent(BaseAgent):
    """
    The synthesis step of the pipeline: combines MonitoringAgent's
    flags with RecommendationAgent's output (if any) into a single
    human-readable decision string plus a machine-readable action
    code. This is the node a UI would ultimately act on.
    """

    name = "DecisionAgent"

    def run(self, context: dict) -> AgentResult:
        flags = context.get("flags", [])
        recommendation = context.get("recommendation")
        vehicle = context.get("vehicle")

        for flag in FLAG_PRIORITY:
            if flag in flags and flag != "TARGET_ALREADY_MET":
                decision = FLAG_MESSAGES[flag]
                context["decision"] = decision
                context["action_code"] = flag
                return AgentResult(
                    agent_name=self.name,
                    summary=decision,
                    output={"action_code": flag, "decision": decision},
                    duration_ms=0,
                )

        if recommendation:
            decision = (
                f"Maintain {recommendation['recommended_speed_kmh']} km/h for "
                f"{recommendation['time_required_hours']}h to reach "
                f"{vehicle.target_soc}% SoC at the assigned station. "
                f"{recommendation['message']}"
            )
            action_code = (
                "SPEED_WARNING"
                if "Warning" in recommendation["message"]
                else "MAINTAIN_RECOMMENDED_SPEED"
            )
            context["decision"] = decision
            context["action_code"] = action_code
            return AgentResult(
                agent_name=self.name,
                summary=decision,
                output={"action_code": action_code, "decision": decision},
                duration_ms=0,
            )

        if "TARGET_ALREADY_MET" in flags:
            decision = FLAG_MESSAGES["TARGET_ALREADY_MET"]
            context["decision"] = decision
            context["action_code"] = "TARGET_ALREADY_MET"
            return AgentResult(
                agent_name=self.name,
                summary=decision,
                output={"action_code": "TARGET_ALREADY_MET", "decision": decision},
                duration_ms=0,
            )

        decision = "No target SoC set — vehicle is cruising, no charging action required."
        context["decision"] = decision
        context["action_code"] = "NO_ACTION"
        return AgentResult(
            agent_name=self.name,
            summary=decision,
            output={"action_code": "NO_ACTION", "decision": decision},
            duration_ms=0,
        )