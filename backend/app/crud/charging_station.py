from sqlalchemy.orm import Session

from app.models.charging_station import ChargingStation
from app.schemas.charging_station import ChargingStationCreate


def get_all(db: Session):
    return db.query(ChargingStation).all()


def get_by_id(db: Session, station_id: int):
    return db.query(ChargingStation).filter(
        ChargingStation.id == station_id
    ).first()


def get_by_highway(db: Session, highway_id: int):
    return db.query(ChargingStation).filter(
        ChargingStation.highway_id == highway_id
    ).all()


def create(db: Session, station: ChargingStationCreate):
    db_station = ChargingStation(**station.model_dump())

    db.add(db_station)
    db.commit()
    db.refresh(db_station)

    return db_station


def delete(db: Session, station_id: int):
    station = get_by_id(db, station_id)

    if station:
        db.delete(station)
        db.commit()

    return station


def update(db: Session, station_id: int, updated_station):
    station = get_by_id(db, station_id)

    if not station:
        return None

    for key, value in updated_station.model_dump().items():
        setattr(station, key, value)

    db.commit()
    db.refresh(station)

    return station