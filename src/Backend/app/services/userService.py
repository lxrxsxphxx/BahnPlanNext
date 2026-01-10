from typing import List, Optional, Sequence

from jose import JWTError

from app import sendmail
from app.schemas.userSchema import UserSchema
from app.models.user import User
from app import database
from app import auth
from fastapi import HTTPException
from sqlmodel import Session, select

class UserService:
    def __init__(self, db: Session):
        """
        :param session: SQLAlchemy Session
        """
        self.db = db

    def create_user(self, user: UserSchema):
        hashed_password = auth.create_password_hash(user.password)
        db_user = User(
            email=user.email,
            username=user.username,
            role=user.role,
            hashed_password=hashed_password
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def get_users(self):
        users = self.db.exec(select(User)).all()
        return users

    def get_user_by_username(self, username: str):
        user = self.db.exec(select(User).where(User.username == username)).first()
        return user

    def get_username_by_token(self, user_token: str):
        claims = auth.decode_token(user_token)
        return claims["username"]

    def get_all_users(self) -> Sequence[User]:
        return self.db.exec(select(User)).all()

    def register_user(self, user: UserSchema):
        # Passwort prüfen
        if not user.password or user.password.strip() == "":
            raise HTTPException(status_code=400,
                                detail="Password must not be empty.")
        try:
            user.password.encode("ascii")
        except UnicodeEncodeError:
            raise HTTPException(
                status_code=400,
                detail="Password must contain only ASCII characters."
            )

        # E-Mail schon vorhanden?
        existing_email_user = self.db.exec(
            select(User).where(User.email == user.email)
        ).first()
        if existing_email_user:
            raise HTTPException(
                status_code=400,
                detail="Ein Benutzer mit dieser E-Mail-Adresse existiert bereits."
            )

        # Benutzername schon vorhanden?
        existing_username_user = self.db.exec(
            select(User).where(
                User.username == user.username)
        ).first()
        if existing_username_user:
            raise HTTPException(
                status_code=400,
                detail="Ein Benutzer mit diesem Benutzernamen existiert bereits."
            )

        # User anlegen
        db_user = self.create_user(user=user)

        # Token erzeugen & Mail schicken
        token = auth.create_verify_token(db_user)
        sendmail.send_mail(to=user.email, token=token,
                           username=user.username)

        return {
            "message": "User erfolgreich registriert. Bitte E-Mail zur Aktivierung prüfen.",
            "user_id": db_user.id,
        }

    def login(self, form_data):
        db_user = self.get_user_by_username(
                                            username=form_data.username)
        if not db_user:
            raise HTTPException(status_code=401,
                                detail="Anmeldedaten nicht korrekt")

        if not db_user.is_active:
            raise HTTPException(
                status_code=401,
                detail="Bitte bestätige zuerst deine Registrierung über den Link in der E-Mail.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if auth.verify_password(form_data.password,
                                db_user.hashed_password):
            token = auth.create_access_token(db_user)
            return {"access_token": token, "token_type": "Bearer"}

        raise HTTPException(status_code=401,
                            detail="Anmeldedaten nicht korrekt")

    # --- /verify/{token} ---
    def verify_user(self, token: str):
        claims = auth.decode_token(token)
        if claims.get("typ") != "verify":
                raise HTTPException(status_code=400, detail="Ungültiger Bestätigungs-Token")

        # Nutzer aus Token holen
        username = claims.get("sub") or claims.get("username")
        if not username:
            raise HTTPException(
                status_code=400,
                detail="Ungültiger Token: Benutzername fehlt."
            )

        # Nutzer in der DB suchen
        db_user = self.get_user_by_username(username)
        if not db_user:
            raise HTTPException(
                status_code=404,
                detail=f"Der Benutzer '{username}' wurde nicht gefunden."
            )

        if db_user.is_active:
            return HTTPException(status_code=409, detail="Account ist bereits aktiviert")

        # Nutzer aktivieren
        db_user.is_active = True
        self.db.commit()
        self.db.refresh(db_user)

        return {"status":"verified"}

    def is_user_in_company_by_username(self, username: str):
        user = self.get_user_by_username(username)
        if not user:
            raise HTTPException(status_code=401, detail="User nicht gefunden")

        if user.companies:
            return {
                "in_company": True,
                "companies": [company.id for company in user.companies],
            }
        return {"in_company": False, "companies": []}
