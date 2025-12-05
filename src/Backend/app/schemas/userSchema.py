from app.models.user import BaseUser


class UserSchema(BaseUser):
  password: str
