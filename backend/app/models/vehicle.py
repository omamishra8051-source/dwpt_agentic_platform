from sqlalchemy import Column, Integer, String

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

    highway = Column(String, default="Not Assigned")