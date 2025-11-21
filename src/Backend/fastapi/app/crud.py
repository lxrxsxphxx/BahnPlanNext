from sqlmodel import Session
from schemas.userSchema import UserSchema
from models.user import User
import auth

def create_User(db: Session, user: UserSchema):
    hashed_password = auth.create_password_hash(user.password)
    db_user = User(
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
    users = db.query(User).all()
    return users

def get_user_by_username(db: Session, username: str):
    user = db.query(User).filter(User.username == username).first()
    return user
