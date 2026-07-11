from sqlalchemy.orm import Session

from app.crud import highway as highway_crud
from app.schemas.highway import HighwayCreate, HighwayUpdate


def get_all_highways(db: Session):
    return highway_crud.get_all(db)


def get_highway(db: Session, highway_id: int):
    return highway_crud.get_by_id(db, highway_id)


def create_highway(db: Session, highway: HighwayCreate):
    return highway_crud.create(db, highway)


def update_highway(
    db: Session,
    highway_id: int,
    highway: HighwayUpdate,
):
    return highway_crud.update(
        db,
        highway_id,
        highway,
    )


def delete_highway(
    db: Session,
    highway_id: int,
):
    return highway_crud.delete(
        db,
        highway_id,
    )