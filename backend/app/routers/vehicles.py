from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicles"]
)


class Vehicle(BaseModel):
    manufacturer: str
    model: str
    battery_capacity: str
    soc: int


vehicles = [
    {
        "id": 1,
        "manufacturer": "Ather",
        "model": "450X",
        "battery_capacity": "3.7 kWh",
        "soc": 78,
    },
    {
        "id": 2,
        "manufacturer": "Ola",
        "model": "S1 Pro",
        "battery_capacity": "4.0 kWh",
        "soc": 64,
    },
    {
        "id": 3,
        "manufacturer": "TVS",
        "model": "iQube",
        "battery_capacity": "3.4 kWh",
        "soc": 52,
    },
]


@router.get("/")
def get_vehicles():
    return vehicles


@router.get("/{vehicle_id}")
def get_vehicle(vehicle_id: int):
    for vehicle in vehicles:
        if vehicle["id"] == vehicle_id:
            return vehicle

    raise HTTPException(status_code=404, detail="Vehicle not found")


@router.post("/")
def add_vehicle(vehicle: Vehicle):
    new_vehicle = vehicle.model_dump()

    new_vehicle["id"] = (
        max(v["id"] for v in vehicles) + 1
        if vehicles
        else 1
    )

    vehicles.append(new_vehicle)

    return new_vehicle


@router.put("/{vehicle_id}")
def update_vehicle(vehicle_id: int, updated_vehicle: Vehicle):

    for vehicle in vehicles:

        if vehicle["id"] == vehicle_id:

            vehicle["manufacturer"] = updated_vehicle.manufacturer
            vehicle["model"] = updated_vehicle.model
            vehicle["battery_capacity"] = updated_vehicle.battery_capacity
            vehicle["soc"] = updated_vehicle.soc

            return vehicle

    raise HTTPException(status_code=404, detail="Vehicle not found")


@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: int):

    for index, vehicle in enumerate(vehicles):

        if vehicle["id"] == vehicle_id:

            deleted = vehicles.pop(index)

            return {
                "message": "Vehicle deleted successfully",
                "vehicle": deleted,
            }

    raise HTTPException(status_code=404, detail="Vehicle not found")