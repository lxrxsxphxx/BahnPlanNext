from datetime import datetime, date
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
  from .tender import Tender
  from .company import Company


class Contract(SQLModel, table=True):
  """
  Results of Tender
  1. Place: 100 %, 2. Place: 20 %, 3. Place: 10 % Subvention.
  """
  __tablename__ = "contracts"

  id: Optional[int] = Field(default=None, primary_key=True)

  tebder_id: int = Field(foreign_key="tender.id")
  company_id: int = Field(foreign_key="companies.id")

  tender: "Tender" = Relationship(back_populates="contracts")
  company: "Company" = Relationship(back_populates="contracts")

  rank: int  # 1 2 oder 3
  subsidy_percentage: float  # 0.2 = 20 %
  subsidy_weekly_amount: int  # gezahlte Subvention pro Woche

  valid_from: date
  valid_until: date
  auto_renew: bool = True

  canceled_at: Optional[datetime] = None
  cancellation_effective_date: Optional[date] = None
