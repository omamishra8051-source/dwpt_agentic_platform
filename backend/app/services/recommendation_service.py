import re

from sqlalchemy.orm import Session

from app.crud import vehicle as vehicle_crud
from app.crud import charging_station as station_crud
from app.crud import highway as highway_crud


def parse_kwh(battery_capacity: str) -> float:
    match = re.search(r"[\d.]+", battery_capacity)

    if not match:
        return 1.0

    return float(match.group())


def calculate_recommendation(
    db: Session,
    vehicle_id: int,
    target_soc: int,
):
    vehicle = vehicle_crud.get_by_id(db, vehicle_id)

    if not vehicle:
        return None, "Vehicle not found"

    if not vehicle.charging_station_id or not vehicle.highway_id:
        return None, "Vehicle is not assigned to a highway and station"

    station = station_crud.get_by_id(db, vehicle.charging_station_id)
    highway = highway_crud.get_by_id(db, vehicle.highway_id)

    distance_remaining = station.position_km - vehicle.position_km

    if distance_remaining <= 0:
        return None, "Vehicle has already reached or passed the assigned station"

    soc_needed = target_soc - vehicle.soc

    battery_kwh = parse_kwh(vehicle.battery_capacity)

    charge_rate = (station.power_output_kw / battery_kwh) * 100

    if soc_needed <= 0:
        return {
            "distance_remaining_km": distance_remaining,
            "soc_needed_percent": 0,
            "charging_power_kw": station.power_output_kw,
            "charge_rate_percent_per_hour": round(charge_rate, 2),
            "time_required_hours": 0,
            "recommended_speed_kmh": highway.speed_limit,
            "highway_speed_limit": highway.speed_limit,
            "message": "Target SOC already reached — maintain highway speed limit.",
        }, None

    time_required = soc_needed / charge_rate

    recommended_speed = distance_remaining / time_required

    message = "Recommended speed calculated successfully."

    if recommended_speed > highway.speed_limit:
        message = (
            "Warning: required speed exceeds highway speed limit — "
            "target SOC may not be reached before the station."
        )
    elif recommended_speed < 5:
        message = (
            "Warning: recommended speed is very low — "
            "consider a lower target SOC or nearer station."
        )

    return {
        "distance_remaining_km": round(distance_remaining, 2),
        "soc_needed_percent": soc_needed,
        "charging_power_kw": station.power_output_kw,
        "charge_rate_percent_per_hour": round(charge_rate, 2),
        "time_required_hours": round(time_required, 2),
        "recommended_speed_kmh": round(recommended_speed, 1),
        "highway_speed_limit": highway.speed_limit,
        "message": message,
    }, None