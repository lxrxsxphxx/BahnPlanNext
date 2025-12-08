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

  # Loans
  loans: List["Loan"] = Relationship(back_populates="company")

  # Vehicles
  vehicles: List["Vehicle"] = Relationship(back_populates="owner")

  # Tenders
  contracts: List["Contract"] = Relationship(back_populates="company")

  # 1:1 SubsidiaryDetails
  subsidiary_details: Optional["SubsidiaryDetails"] = Relationship(
      back_populates="company",
      sa_relationship_kwargs={"uselist": False},
  )

class SubsidiaryDetails(SQLModel, table=True):
    """
    1:1-Detailtabelle nur für Tochtergesellschaften.

    PK = company_id (gleichzeitig FK auf companies.id)
    """
    __tablename__ = "subsidiary_details"

    company_id: int = Field(
      primary_key=True,
      foreign_key="companies.id",
    )

    internal_code: Optional[str] = None
    risk_category: Optional[str] = None  # "LOW" | "MEDIUM" | "HIGH"
    notes: Optional[str] = None

    company: Company = Relationship(
      back_populates="subsidiary_details",
      sa_relationship_kwargs={"uselist": False},
    )
