from app.models.user import BaseUser
from pydantic import Field

class UserSchema(BaseUser):
  password: str = Field(min_length=8, max_length=128)
