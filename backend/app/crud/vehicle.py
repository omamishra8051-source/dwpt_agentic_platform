from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate


def get_all(db: Session):
    return db.query(Vehicle).all()


def get_by_id(db: Session, vehicle_id: int):
    return db.query(Vehicle).filter(
        Vehicle.id == vehicle_id
    ).first()


def create(db: Session, vehicle: VehicleCreate):
    db_vehicle = Vehicle(**vehicle.model_dump())

    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)

    return db_vehicle


def delete(db: Session, vehicle_id: int):
    vehicle = get_by_id(db, vehicle_id)

    if vehicle:
        db.delete(vehicle)
        db.commit()

    return vehicle


def update(db: Session, vehicle_id: int, updated_vehicle):
    vehicle = get_by_id(db, vehicle_id)

    if not vehicle:
        return None

    for key, value in updated_vehicle.model_dump().items():
        setattr(vehicle, key, value)

    db.commit()
    db.refresh(vehicle)

    return vehicle