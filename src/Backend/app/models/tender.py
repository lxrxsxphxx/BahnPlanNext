from datetime import datetime, date
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

from .company import Company
from .route import Route
from .contract import Contract

class Tender(SQLModel, table=True):
  """
  Ausschreibung (engl. Tender) auf einer Strecke mit Takt-/Bedienzeiten.
  """
  __tablename__ = "tenders"

  id: Optional[int] = Field(default=None, primary_key=True)
  name: str
  description: Optional[str] = None

  route_id: int = Field(foreign_key="routes.id")
  route: Route = Relationship(back_populates="tenders")

  # Vertragsdaten (Standard: 1 Jahr)
  contract_start_monday: Optional[date] = None
  contract_duration_weeks: int = 52

  # Takt/Bedienzeiten
  takt_description: Optional[str] = None
  service_time_description: Optional[str] = None

  bids: List["TenderBid"] = Relationship(back_populates="tender")
  contracts: List["Contract"] = Relationship(back_populates="tender")


class TenderBid(SQLModel, table=True):
  """
  Gebot einer Gesellschaft auf Ausschreibung.
  """
  __tablename__ = "tender_bid"

  id: Optional[int] = Field(default=None, primary_key=True)

  tender_id: int = Field(foreign_key="tenders.id")
  company_id: int = Field(foreign_key="companies.id")

  tender: Tender = Relationship(back_populates="bids")
  company: Company = Relationship()

  submitted_at: datetime = Field(default_factory=datetime.utcnow)
  weekly_subsidy_request: int  # Subventionsforderung pro Woche

  # Pfad zu Umlaufplan (Excel)
  schedule_file_path: Optional[str] = None
