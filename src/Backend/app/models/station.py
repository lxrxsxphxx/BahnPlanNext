from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
  from .route import Route
  from .workshop import Workshop


class Station(SQLModel, table=True):
  __tablename__ = "stations"

  id: Optional[int] = Field(default=None, primary_key=True)
  name: str
  # später mal: Koordinaten, Region etc.

  routes_from: List["Route"] = Relationship(back_populates="start_station", sa_relationship_kwargs={"foreign_keys": "[Route.start_station_id]"})
  routes_to: List["Route"] = Relationship(back_populates="end_station", sa_relationship_kwargs={"foreign_keys": "[Route.end_station_id]"})
  workshops: List["Workshop"] = Relationship(back_populates="station")
