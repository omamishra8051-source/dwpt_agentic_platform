from pydantic import BaseModel


class HighwayBase(BaseModel):
    name: str
    length_km: int
    speed_limit: int
    lane_count: int

    charging_station_count: int = 0
    traffic_density: str = "Low"
    status: str = "Active"


class HighwayCreate(HighwayBase):
    pass


class HighwayUpdate(HighwayBase):
    pass


class HighwayResponse(HighwayBase):
    id: int

    model_config = {
        "from_attributes": True
    }