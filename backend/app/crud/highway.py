from sqlalchemy.orm import Session

from app.models.highway import Highway
from app.schemas.highway import HighwayCreate, HighwayUpdate


def get_all(db: Session):
    return db.query(Highway).all()


def get_by_id(db: Session, highway_id: int):
    return db.query(Highway).filter(
        Highway.id == highway_id
    ).first()


def create(db: Session, highway: HighwayCreate):
    db_highway = Highway(**highway.model_dump())

    db.add(db_highway)
    db.commit()
    db.refresh(db_highway)

    return db_highway


def update(
    db: Session,
    highway_id: int,
    updated_highway: HighwayUpdate,
):
    highway = get_by_id(db, highway_id)

    if not highway:
        return None

    for key, value in updated_highway.model_dump().items():
        setattr(highway, key, value)

    db.commit()
    db.refresh(highway)

    return highway


def delete(db: Session, highway_id: int):
    highway = get_by_id(db, highway_id)

    if highway:
        db.delete(highway)
        db.commit()

    return highway