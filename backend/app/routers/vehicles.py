from fastapi import APIRouter

router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicles"]
)

vehicles = [
    {
        "id": 1,
        "manufacturer": "Ather",
        "model": "450X",
        "battery_capacity": "3.7 kWh",
        "soc": 78
    },
    {
        "id": 2,
        "manufacturer": "Ola",
        "model": "S1 Pro",
        "battery_capacity": "4.0 kWh",
        "soc": 64
    },
    {
        "id": 3,
        "manufacturer": "TVS",
        "model": "iQube",
        "battery_capacity": "3.4 kWh",
        "soc": 52
    }
]


@router.get("/")
def get_vehicles():
    return vehicles