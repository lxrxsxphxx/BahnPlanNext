from typing import Optional
from datetime import time
from sqlmodel import SQLModel, Field

class RouteStop(SQLModel, table=True):
    __tablename__ = "route_stops"

    id: Optional[int] = Field(default=None, primary_key=True)

    route_id: int = Field(foreign_key="routes.id", index=True)
    station_id: int = Field(foreign_key="stations.id", index=True)

    seq: int = Field(index=True)
    km: float

    # Richtung A (z.B. Hin)
    arr_a: Optional[time] = None
    dep_a: Optional[time] = None

    # Richtung B (z.B. Rück)
    arr_b: Optional[time] = None
    dep_b: Optional[time] = None
