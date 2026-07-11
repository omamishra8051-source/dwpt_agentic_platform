from sqlalchemy.orm import Session

from app.agents.base import BaseAgent, AgentResult
from app.crud import vehicle as vehicle_crud
from app.crud import highway as highway_crud
from app.crud import charging_station as station_crud


class DataAgent(BaseAgent):
    """
    Pulls the vehicle record and its related highway / charging
    station (if assigned) into the shared blackboard context.
    Every downstream agent reads from context instead of touching
    the database directly, so the DB is only hit once per pipeline
    run for the core entities.
    """

    name = "DataAgent"

    def __init__(self, db: Session):
        self.db = db

    def run(self, context: dict) -> AgentResult:
        vehicle_id = context["vehicle_id"]
        vehicle = vehicle_crud.get_by_id(self.db, vehicle_id)

        if not vehicle:
            context["vehicle"] = None
            return AgentResult(
                agent_name=self.name,
                summary=f"No vehicle found with id={vehicle_id}.",
                output={"vehicle_id": vehicle_id, "found": False},
                duration_ms=0,
            )

        highway = (
            highway_crud.get_by_id(self.db, vehicle.highway_id)
            if vehicle.highway_id
            else None
        )
        station = (
            station_crud.get_by_id(self.db, vehicle.charging_station_id)
            if vehicle.charging_station_id
            else None
        )

        context["vehicle"] = vehicle
        context["highway"] = highway
        context["station"] = station

        output = {
            "vehicle": f"{vehicle.manufacturer} {vehicle.model} (id={vehicle.id})",
            "soc": vehicle.soc,
            "target_soc": vehicle.target_soc,
            "position_km": vehicle.position_km,
            "highway": highway.name if highway else None,
            "station": station.name if station else None,
        }

        return AgentResult(
            agent_name=self.name,
            summary=(
                f"Loaded {vehicle.manufacturer} {vehicle.model} "
                f"(SoC {vehicle.soc}%) with related highway/station context."
            ),
            output=output,
            duration_ms=0,
        )