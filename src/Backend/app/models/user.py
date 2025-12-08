from sqlmodel import SQLModel, Field, Relationship
from pydantic import EmailStr
from typing import Optional, List, TYPE_CHECKING

from ..enums.roles import Roles
from .company import CompanyUserLink, Company


class BaseUser(SQLModel):  # BaseUser noch ohne passwort
  email: EmailStr  # aus pydantic
  username: str
  is_active: bool = False
  role: Roles


class User(BaseUser, table=True):
  __tablename__ = "users"
  id: Optional[int] = Field(default=None, primary_key=True)
  hashed_password: str

  companies: List["Company"] = Relationship(
    back_populates="members",
    link_model=CompanyUserLink
  )
