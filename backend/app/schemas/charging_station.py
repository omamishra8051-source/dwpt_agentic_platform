from pydantic import BaseModel


class ChargingStationBase(BaseModel):
    name: str
    location: str
    power_output_kw: float

    status: str = "Available"

    position_km: int = 0

    highway_id: int


class ChargingStationCreate(ChargingStationBase):
    pass


class ChargingStationUpdate(ChargingStationBase):
    pass


class ChargingStationResponse(ChargingStationBase):
    id: int

    model_config = {
        "from_attributes": True
    }