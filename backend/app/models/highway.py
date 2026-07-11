from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Highway(Base):
    __tablename__ = "highways"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False, unique=True)

    length_km = Column(Integer, nullable=False)

    speed_limit = Column(Integer, nullable=False)

    lane_count = Column(Integer, nullable=False)

    charging_station_count = Column(Integer, default=0)

    traffic_density = Column(String, default="Low")

    status = Column(String, default="Active")

    vehicles = relationship(
        "Vehicle",
        back_populates="highway",
    )