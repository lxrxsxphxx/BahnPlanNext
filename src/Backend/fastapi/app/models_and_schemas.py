from sqlmodel import SQLModel, Field
from pydantic import EmailStr
from enum import Enum
from typing import Optional #um Parameter als optional zu kennzeichnen

class Roles(str, Enum):
    user = "user" #user heißen user
    admin = "admin" #admins heißen admin

class BaseUser(SQLModel): #BaseUser noch ohne passwort
    email: EmailStr #aus pydantic
    username: str
    is_active: bool = False
    role: Roles

class User(BaseUser, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str


class UserSchema(BaseUser):
    password: str