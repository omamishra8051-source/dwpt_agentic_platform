from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)

    manufacturer = Column(String, nullable=False)

    model = Column(String, nullable=False)

    battery_capacity = Column(String, nullable=False)

    soc = Column(Integer, nullable=False)

    battery_health = Column(String, default="Good")

    status = Column(String, default="Idle")

    position_km = Column(Integer, nullable=False, default=0)

    target_soc = Column(Integer, nullable=True)

    highway_id = Column(
        Integer,
        ForeignKey("highways.id"),
        nullable=True,
    )

    charging_station_id = Column(
        Integer,
        ForeignKey("charging_stations.id"),
        nullable=True,
    )

    highway = relationship(
        "Highway",
        back_populates="vehicles",
    )

    charging_station = relationship(
        "ChargingStation",
    )