from sqlalchemy.orm import Session

from app.crud import vehicle as vehicle_crud
from app.crud import charging_station as station_crud
from app.schemas.vehicle import VehicleCreate, VehicleUpdate


def get_all_vehicles(db: Session):
    return vehicle_crud.get_all(db)


def get_vehicle(db: Session, vehicle_id: int):
    return vehicle_crud.get_by_id(db, vehicle_id)


def create_vehicle(db: Session, vehicle: VehicleCreate):
    return vehicle_crud.create(db, vehicle)


def update_vehicle(
    db: Session,
    vehicle_id: int,
    vehicle: VehicleUpdate,
):
    return vehicle_crud.update(
        db,
        vehicle_id,
        vehicle,
    )


def delete_vehicle(
    db: Session,
    vehicle_id: int,
):
    return vehicle_crud.delete(
        db,
        vehicle_id,
    )


def assign_vehicle(
    db: Session,
    vehicle_id: int,
    highway_id: int,
    charging_station_id: int,
):
    vehicle = vehicle_crud.get_by_id(db, vehicle_id)

    if not vehicle:
        return None, "Vehicle not found"

    station = station_crud.get_by_id(db, charging_station_id)

    if not station:
        return None, "Charging station not found"

    if station.highway_id != highway_id:
        return None, "Station does not belong to the selected highway"

    updated = vehicle_crud.assign(
        db,
        vehicle_id,
        highway_id,
        charging_station_id,
    )

    return updated, None