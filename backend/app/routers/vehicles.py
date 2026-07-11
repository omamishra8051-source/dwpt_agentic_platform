from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.vehicle import (
    VehicleCreate,
    VehicleUpdate,
    VehicleResponse,
    VehicleAssignment,
    VehicleStatusResponse,
)
from app.schemas.recommendation import (
    RecommendationRequest,
    RecommendationResponse,
)
from app.services import vehicle_service
from app.services import recommendation_service

router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicles"],
)


@router.get("/", response_model=list[VehicleResponse])
def get_vehicles(db: Session = Depends(get_db)):
    return vehicle_service.get_all_vehicles(db)


@router.get("/status/all", response_model=list[VehicleStatusResponse])
def get_all_vehicle_statuses(db: Session = Depends(get_db)):
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


@router.post("/{vehicle_id}/assign", response_model=VehicleResponse)
def assign_vehicle(
    vehicle_id: int,
    assignment: VehicleAssignment,
    db: Session = Depends(get_db),
):
    vehicle, error = vehicle_service.assign_vehicle(
        db,
        vehicle_id,
        assignment.highway_id,
        assignment.charging_station_id,
    )

    if error:
        status_code = 404 if "not found" in error else 400
        raise HTTPException(status_code=status_code, detail=error)

    return vehicle


@router.post(
    "/{vehicle_id}/recommendation",
    response_model=RecommendationResponse,
)
def get_recommendation(
    vehicle_id: int,
    request: RecommendationRequest,
    db: Session = Depends(get_db),
):
    result, error = recommendation_service.calculate_recommendation(
        db,
        vehicle_id,
        request.target_soc,
    )

    if error:
        raise HTTPException(status_code=400, detail=error)

    return result