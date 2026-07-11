from pydantic import BaseModel


class VehicleBase(BaseModel):
    manufacturer: str
    model: str
    battery_capacity: str
    soc: int

    battery_health: str = "Good"

    status: str = "Idle"

    highway: str = "Not Assigned"


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(VehicleBase):
    pass


class VehicleResponse(VehicleBase):
    id: int

    model_config = {
        "from_attributes": True
    }