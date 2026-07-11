from sqlalchemy.orm import Session

from app.crud import charging_station as station_crud
from app.schemas.charging_station import (
    ChargingStationCreate,
    ChargingStationUpdate,
)


def get_all_stations(db: Session):
    return station_crud.get_all(db)


def get_stations_by_highway(db: Session, highway_id: int):
    return station_crud.get_by_highway(db, highway_id)


def get_station(db: Session, station_id: int):
    return station_crud.get_by_id(db, station_id)


def create_station(db: Session, station: ChargingStationCreate):
    return station_crud.create(db, station)


def update_station(
    db: Session,
    station_id: int,
    station: ChargingStationUpdate,
):
    return station_crud.update(
        db,
        station_id,
        station,
    )


def delete_station(
    db: Session,
    station_id: int,
):
    return station_crud.delete(
        db,
        station_id,
    )