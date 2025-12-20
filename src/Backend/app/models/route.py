from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID,uuid4

if TYPE_CHECKING:
  from .station import Station
  from .tender import Tender


class Route(SQLModel, table=True):
  __tablename__ = "routes"

  id: Optional[int] = Field(default=None, primary_key=True)

  uuid: UUID = Field(default_factory=uuid4, index=True, unique=True,
                     nullable=False)
  name: str
  start_station_id: int = Field(foreign_key="stations.id")
  end_station_id: int = Field(foreign_key="stations.id")
  distance_km: float

  # Detailfelder (orientiert am alten BahnPlan-Detail)
  track_type: str = Field(default="durch BahnPlan subventionierte Trasse")
  min_service_percent: int = Field(default=60)
  min_trips_per_week_dir: int = Field(default=50)
  service_speed_kmh: int = Field(default=160)
  max_train_length_wagons: int = Field(default=12)
  capacity_recommendation_seats: int = Field(default=350)
  cost_per_trip_eur: float = Field(default=1176.65)

  allow_ir: bool = Field(default=True)
  allow_ic: bool = Field(default=True)
  allow_ice: bool = Field(default=False)
  special_notes: Optional[str] = Field(
      default="nur Dieselfahrzeuge einsetzbar")

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
