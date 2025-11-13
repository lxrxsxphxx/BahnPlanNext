from sqlmodel import Session
from . import models_and_schemas, auth

def create_User(db: Session, user: models_and_schemas.UserSchema):
    hashed_password = auth.create_password_hash(user.password)
    db_user = models_and_schemas.User(
        email = user.email,
        username = user.username,
        role = user.role,
        hashed_password = hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user # kann auch weg bleiben, aber für debuggen besser

def get_users(db: Session):
    users = db.query(models_and_schemas.User).all()
    return users

def get_user_by_username(db: Session, username: str):
    user = db.query(models_and_schemas.User).filter(models_and_schemas.User.username == username).first()
    return user