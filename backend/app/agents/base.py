import time
from abc import ABC, abstractmethod


class AgentResult:
    """
    A single agent's contribution to the pipeline trace.
    Kept as a plain object (not a Pydantic model) so agents stay
    framework-agnostic — the router layer converts these to the
    response schema.
    """

    def __init__(self, agent_name: str, summary: str, output: dict, duration_ms: float):
        self.agent_name = agent_name
        self.summary = summary
        self.output = output
        self.duration_ms = duration_ms

    def to_dict(self):
        return {
            "agent": self.agent_name,
            "summary": self.summary,
            "output": self.output,
            "duration_ms": self.duration_ms,
        }


class BaseAgent(ABC):
    """
    Every agent in the pipeline reads from and writes to a shared
    'blackboard' dict (the context object passed through the
    Orchestrator). This mirrors the Blackboard architectural pattern:
    agents don't call each other directly, they only read/write shared
    state, so agents can be added, removed, or reordered without
    touching each other's code.
    """

    name = "BaseAgent"

    @abstractmethod
    def run(self, context: dict) -> AgentResult:
        ...

    def _timed_run(self, context: dict) -> AgentResult:
        start = time.perf_counter()
        result = self.run(context)
        elapsed_ms = round((time.perf_counter() - start) * 1000, 3)
        result.duration_ms = elapsed_ms
        return result