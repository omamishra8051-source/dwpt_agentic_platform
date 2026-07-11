from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.vehicle import (
    VehicleCreate,
    VehicleUpdate,
    VehicleResponse,
)
from app.services import vehicle_service

router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicles"],
)


@router.get("/", response_model=list[VehicleResponse])
def get_vehicles(db: Session = Depends(get_db)):
    return vehicle_service.get_all_vehicles(db)


@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = vehicle_service.get_vehicle(db, vehicle_id)

    if vehicle is None:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found",
        )

    return vehicle


@router.post("/", response_model=VehicleResponse)
def create_vehicle(
    vehicle: VehicleCreate,
    db: Session = Depends(get_db),
):
    return vehicle_service.create_vehicle(
        db,
        vehicle,
    )


@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(
    vehicle_id: int,
    vehicle: VehicleUpdate,
    db: Session = Depends(get_db),
):
    updated = vehicle_service.update_vehicle(
        db,
        vehicle_id,
        vehicle,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found",
        )

    return updated


@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
):
    deleted = vehicle_service.delete_vehicle(
        db,
        vehicle_id,
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found",
        )

    return {
        "message": "Vehicle deleted successfully"
    }