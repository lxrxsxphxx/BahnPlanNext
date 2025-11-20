from datetime import datetime
from typing import Optional, List, TYPE_CHECKING

from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .user import User
    from .loan import Loan
    from .vehicle import Vehicle
    from .contract import Contract

class CompanyUserLink(SQLModel, table=True):
  __tablename__ = "company_user_link"

  user_id: Optional[int] = Field(
    default=None,
    foreign_key="users.id",
    primary_key=True,
  )
  company_id: Optional[int] = Field(
    default=None,
    foreign_key="companies.id",
    primary_key=True,
  )

  # Flag für Besitzer der Gesellschaft
  is_owner: bool = False
  joined_at: datetime = Field(default_factory=datetime.utcnow)


class Company(SQLModel, table=True):
  __tablename__ = "companies"

  id: Optional[int] = Field(default=None, primary_key=True)
  name: str
  capital: int = Field(default=4_000_000)  # Startkapital
  created_at: datetime = Field(default_factory=datetime.utcnow)
  last_active_at: datetime = Field(default_factory=datetime.utcnow)

  # Self-Relation: Muttergesellschaft
  parent_company_id: Optional[int] = Field(
    default=None,
    foreign_key="companies.id"
  )
  parent_company: Optional["Company"] = Relationship(
    back_populates="subsidiaries",
    sa_relationship_kwargs={"remote_side": "Company.id"},
  )
  subsidiaries: List["Company"] = Relationship(back_populates="parent_company")

  # Member der Gesellschaft
  members: List["User"] = Relationship(
    back_populates="companies",
    link_model=CompanyUserLink
  )

  # Kredite
  loans: List["Loan"] = Relationship(back_populates="company")

  # Fahrzeuge
  vehicles: List["Vehicle"] = Relationship(back_populates="owner")

  # Ausschreibungen
  contracts: List["Contract"] = Relationship(back_populates="company")
