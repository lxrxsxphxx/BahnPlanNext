from datetime import datetime, date
from typing import Optional

from sqlmodel import SQLModel, Field, Relationship

from .company import Company


class Loan(SQLModel, table=True):
  __tablename__ = "loans"

  id: Optional[int] = Field(default=None, primary_key=True)
  company_id: int = Field(foreign_key="companies.id")
  company: Company = Relationship(back_populates="loans")

  principal: int # originale Schuld
  remaining_principal: int  # Restschuld
  interest_rate_weekly: float = Field(default=0.0015)  # 0,15 % pro Woche
  created_at: datetime = Field(default_factory=datetime.utcnow)
  due_date: Optional[date] = None
  is_overdraft: bool = False
