from datetime import datetime, date
from typing import Optional
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


class Vehicle(SQLModel, table=True):
  """
  Konkretes Fahrzeug im Besitz/Leasing einer Gesellschaft.
  Zustand sinkt alle 6 Monate, Reparatur etc.
  """
  __tablename__ = "vehicles"

  vehicle_number: str = Field(
      index=True,
      nullable=False,
      description="Fachliche Fahrzeugnummer (z. B. ICE-401-012)"
  )

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
