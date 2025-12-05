from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

from ..enums.workshop import WorkshopType
from ..models import Station, Company


class Workshop(SQLModel, table=True):
  """
  Betriebswerk/Werkstatt an einem Bahnhof.
  """
  __tablename__ = "workshops"

  id: Optional[int] = Field(default=None, primary_key=True)

  station_id: int = Field(foreign_key="stations.id")
  owner_company_id: int = Field(foreign_key="companies.id")

  station: Station = Relationship(back_populates="workshops")
  owner: Company = Relationship()

  type: WorkshopType  # BW oder AW
  stands: int = 2  # Anzahl Stände
  built_at: datetime = Field(default_factory=datetime.utcnow)
