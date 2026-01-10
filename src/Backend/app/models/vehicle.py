from datetime import datetime, date
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

from ..enums.vehicle import VehicleKind
from .company import Company


class VehicleType(SQLModel, table=True):
  """
  Stammdaten eines Fahrzeugtyps (z.B. Baureihe 481/485).
  """
  __tablename__ = "vehicle_types"

  id: Optional[int] = Field(default=None, primary_key=True)
  name: str
  kind: VehicleKind

  new_price: int
  km_cost: float
  energy_cost_base: float
  details: Optional["VehicleTypeDetails"] = Relationship(
    back_populates="vehicle_type",
    sa_relationship_kwargs={"uselist": False},
  )


class Vehicle(SQLModel, table=True):
  """
  Konkretes Fahrzeug im Besitz/Leasing einer Gesellschaft.
  Zustand sinkt alle 6 Monate, Reparatur etc.
  """
  __tablename__ = "vehicles"

  id: Optional[int] = Field(default=None, primary_key=True)

  type_id: int = Field(foreign_key="vehicle_types.id")
  owner_company_id: int = Field(foreign_key="companies.id")

  type: VehicleType = Relationship()
  owner: Company = Relationship(back_populates="vehicles")

  condition_percent: float = 100.0  # Zustand in %
  acquired_at: datetime = Field(default_factory=datetime.utcnow)

  # Leasing
  is_leased: bool = False
  leasing_model: Optional[int] = None  # 1 bis 4
  lease_start: Optional[date] = None
  lease_annual_rate_percent: Optional[float] = None
  lease_weekly_rate_percent: Optional[float] = None

class VehicleTypeDetails(SQLModel, table=True):
  """
  Detaildaten eines Fahrzeugtyps (Triebfahrzeugübersicht).
  1:1 zu vehicle_types.
  """
  __tablename__ = "vehicle_type_details"

  vehicle_type_id: int = Field(
    primary_key=True,
    foreign_key="vehicle_types.id",
  )

  traction_type: Optional[str] = None  # z.B. "Elektrolokomotive"

  suitable_passenger_max_wagons: Optional[int] = None
  suitable_freight_max_tons: Optional[int] = None

  countries_allowed: Optional[str] = None  # z.B. "D,AT"

  power_kw: Optional[int] = None
  max_speed_kmh: Optional[int] = None

  depot_category: Optional[int] = None  # 1..7
  max_traction_units: Optional[int] = None  # z.B. 2

  image_key: Optional[str] = None  # Dateiname oder Pfad/Key

  total_stock: Optional[int] = None
  available_stock: Optional[int] = None

  vehicle_type: "VehicleType" = Relationship(back_populates="details")


class VehicleTypeCouplingLink(SQLModel, table=True):
    __tablename__ = "vehicle_type_coupling_links"

    left_type_id: int = Field(foreign_key="vehicle_types.id", primary_key=True)
    right_type_id: int = Field(foreign_key="vehicle_types.id", primary_key=True)
