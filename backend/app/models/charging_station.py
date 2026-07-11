from sqlalchemy import Column, Integer, Float, String, ForeignKey

from app.database import Base


class ChargingStation(Base):
    __tablename__ = "charging_stations"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    location = Column(String, nullable=False)

    power_output_kw = Column(Float, nullable=False)

    status = Column(String, default="Available")

    position_km = Column(Integer, nullable=False, default=0)

    highway_id = Column(Integer, ForeignKey("highways.id"), nullable=False)