from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
  from .station import Station
  from .tender import Tender


class Route(SQLModel, table=True):
  __tablename__ = "routes"

  id: Optional[int] = Field(default=None, primary_key=True)
  name: str

  start_station_id: int = Field(foreign_key="stations.id")
  end_station_id: int = Field(foreign_key="stations.id")
  distance_km: float

  start_station: "Station" = Relationship(
    back_populates="routes_from",
    sa_relationship_kwargs={"foreign_keys": "[Route.start_station_id]"},
  )
  end_station: "Station" = Relationship(
    back_populates="routes_to",
    sa_relationship_kwargs={"foreign_keys": "[Route.end_station_id]"}, # refers to specific column
  )
  # list of Tenders for this specific track (maybe never used, but good for now)
  tenders: List["Tender"] = Relationship(back_populates="route")
