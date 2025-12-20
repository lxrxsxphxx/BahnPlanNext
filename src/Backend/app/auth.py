import os
from passlib.context import CryptContext
from .models.user import User
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, Request

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", str(60 * 24 * 30)))  # default: 30 Tage
JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHMUS = "HS256"

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def create_password_hash(password): # benötigt um auf DB zu speichern
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password): # benötigt wenn query zugreift
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(user: User):
    claims = {
        "sub": user.username,
        "username": user.username,
        "email": user.email,
        "role":  user.role,
        "active": user.is_active,
        "typ": "access",
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    return jwt.encode(claims=claims, key=JWT_SECRET, algorithm=ALGORITHMUS)


def create_verify_token(user: User):
    claims = {
        "sub": user.username,
        "username": user.username,
        "email": user.email,
        "typ": "verify",
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(claims=claims, key=JWT_SECRET, algorithm=ALGORITHMUS)

def get_token(request: Request):
    # 1. Cookie
    token = request.cookies.get("access_token")
    if token:
        return token

    # 2. Authorization Header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ", 1)[1]

    raise HTTPException(
        status_code=401,
        detail="Nicht authentifiziert",
        headers={"WWW-Authenticate": "Bearer"},
    )

def decode_token(token):
    try:
        return jwt.decode(token, key=JWT_SECRET, algorithms=[ALGORITHMUS])
    except JWTError:
        raise HTTPException(status_code=401, detail="Token ungültig oder abgelaufen")

def check_active(token: str = Depends(get_token)):
    claims = decode_token(token)

    if claims.get("typ") != "access":
        raise HTTPException(status_code=401, detail="Falscher Token-Typ")

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
