from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.charging_station import (
    ChargingStationCreate,
    ChargingStationUpdate,
    ChargingStationResponse,
)
from app.services import charging_station_service

router = APIRouter(
    prefix="/charging-stations",
    tags=["Charging Stations"],
)


@router.get("/", response_model=list[ChargingStationResponse])
def get_stations(highway_id: int | None = None, db: Session = Depends(get_db)):
    if highway_id is not None:
        return charging_station_service.get_stations_by_highway(db, highway_id)
    return charging_station_service.get_all_stations(db)


@router.get("/{station_id}", response_model=ChargingStationResponse)
def get_station(station_id: int, db: Session = Depends(get_db)):
    station = charging_station_service.get_station(db, station_id)

    if station is None:
        raise HTTPException(
            status_code=404,
            detail="Charging station not found",
        )

    return station


@router.post("/", response_model=ChargingStationResponse)
def create_station(
    station: ChargingStationCreate,
    db: Session = Depends(get_db),
):
    return charging_station_service.create_station(
        db,
        station,
    )


@router.put("/{station_id}", response_model=ChargingStationResponse)
def update_station(
    station_id: int,
    station: ChargingStationUpdate,
    db: Session = Depends(get_db),
):
    updated = charging_station_service.update_station(
        db,
        station_id,
        station,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Charging station not found",
        )

    return updated


@router.delete("/{station_id}")
def delete_station(
    station_id: int,
    db: Session = Depends(get_db),
):
    deleted = charging_station_service.delete_station(
        db,
        station_id,
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Charging station not found",
        )

    return {
        "message": "Charging station deleted successfully"
    }