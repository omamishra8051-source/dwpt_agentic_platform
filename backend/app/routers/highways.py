from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.highway import (
    HighwayCreate,
    HighwayUpdate,
    HighwayResponse,
)
from app.services import highway_service

router = APIRouter(
    prefix="/highways",
    tags=["Highways"],
)


@router.get("/", response_model=list[HighwayResponse])
def get_highways(db: Session = Depends(get_db)):
    return highway_service.get_all_highways(db)


@router.get("/{highway_id}", response_model=HighwayResponse)
def get_highway(
    highway_id: int,
    db: Session = Depends(get_db),
):
    highway = highway_service.get_highway(
        db,
        highway_id,
    )

    if highway is None:
        raise HTTPException(
            status_code=404,
            detail="Highway not found",
        )

    return highway


@router.post("/", response_model=HighwayResponse)
def create_highway(
    highway: HighwayCreate,
    db: Session = Depends(get_db),
):
    return highway_service.create_highway(
        db,
        highway,
    )


@router.put("/{highway_id}", response_model=HighwayResponse)
def update_highway(
    highway_id: int,
    highway: HighwayUpdate,
    db: Session = Depends(get_db),
):
    updated = highway_service.update_highway(
        db,
        highway_id,
        highway,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Highway not found",
        )

    return updated


@router.delete("/{highway_id}")
def delete_highway(
    highway_id: int,
    db: Session = Depends(get_db),
):
    deleted = highway_service.delete_highway(
        db,
        highway_id,
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Highway not found",
        )

    return {
        "message": "Highway deleted successfully"
    }