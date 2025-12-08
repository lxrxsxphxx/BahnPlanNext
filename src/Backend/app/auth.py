import os
from passlib.context import CryptContext
from .models.user import User
from jose import jwt
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException

JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHMUS = "HS256"

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_password_hash(password): # benötigt um auf DB zu speichern
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password): # benötigt wenn query zugreift
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(user: User):
    claims = {
        "sub": user.username,
        "email": user.email,
        "role":  user.role,
        "active": user.is_active,
        "exp": datetime.utcnow() + timedelta(minutes=120)
    }
    return jwt.encode(claims=claims, key=JWT_SECRET, algorithm=ALGORITHMUS)

def decode_token(token):
    claims = jwt.decode(token, key=JWT_SECRET)
    return claims

def check_active(token: str = Depends(oauth2_scheme)):
    claims = decode_token(token)
    if claims.get("active"):
        return claims
    raise HTTPException(
        status_code=401,
        detail= "Bitte aktiviere deinen Account",
        headers={"WWW-Authenticate": "Bearer"}
    )


def check_admin(claims: dict = Depends(check_active)):
    role = claims.get("role")
    if role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Nur für Admins erreichbar",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return claims
