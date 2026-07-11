from pydantic import BaseModel

from app.schemas.highway import HighwayResponse
from app.schemas.charging_station import ChargingStationResponse


class VehicleBase(BaseModel):
    manufacturer: str
    model: str
    battery_capacity: str
    soc: int

    battery_health: str = "Good"

    status: str = "Idle"

    position_km: int = 0

    target_soc: int | None = None

    highway_id: int | None = None

    charging_station_id: int | None = None


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(VehicleBase):
    pass


class VehicleResponse(VehicleBase):
    id: int

    model_config = {
        "from_attributes": True
    }


class VehicleAssignment(BaseModel):
    highway_id: int
    charging_station_id: int


class VehicleStatusResponse(VehicleBase):
    id: int

    highway: HighwayResponse | None = None
    charging_station: ChargingStationResponse | None = None

    model_config = {
        "from_attributes": True
    }