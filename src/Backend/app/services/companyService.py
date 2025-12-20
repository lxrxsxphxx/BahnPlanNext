import re
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from sqlmodel import Session, select

from app import auth
from app.models.user import User
from app.models.company import Company, CompanyUserLink

MAX_NAME_LEN = 25

INVALID_NAME_MSG = "Ungültiger Name! erlaubt sind nur: A–Z, a–z, 0–9 und Standard-Satzzeichen"
TOO_LONG_MSG = f"Name zu lang! Maximal {MAX_NAME_LEN} Zeichen."
NAME_EXISTS_MSG = "Name existiert bereits!"

_ALLOWED_RE = re.compile(r"^[A-Za-z0-9 .,;:!?\"'()\[\]\{\}\-_/+&@#]+$")

class CompanyService:
    def __init__(self, db: Session):
        """
        :param db: SQLModel Session
        """
        self.db = db

    def normalize_name(self, raw: str) -> str:
        return (raw or "").strip()

    def validate_name(self, name: str) -> None:
        if not name or not _ALLOWED_RE.match(name):
            raise HTTPException(status_code=400, detail=INVALID_NAME_MSG)

        if len(name) > MAX_NAME_LEN:
            raise HTTPException(status_code=400, detail=TOO_LONG_MSG)

    def get_user_by_token(self, user_token: str) -> User:
        try:
            claims = auth.decode_token(user_token)
        except Exception:
            raise HTTPException(status_code=401, detail="Ungültiger Token.")

        if not claims.get("active"):
            raise HTTPException(
                status_code=401,
                detail="Bitte bestätige zuerst deine Registrierung über den Link in der E-Mail.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        username = claims.get("username") or claims.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Ungültiger Token: Benutzername fehlt.")

        user = self.db.exec(select(User).where(User.username == username)).first()
        if not user:
            raise HTTPException(status_code=401, detail="User nicht gefunden.")
        return user

    def user_has_company(self, user_id: int) -> bool:
        link = self.db.exec(
            select(CompanyUserLink).where(CompanyUserLink.user_id == user_id)
        ).first()
        return link is not None

    def company_name_exists(self, name: str) -> bool:
        return self.db.exec(select(Company).where(Company.name == name)).first() is not None

    def create_company(self, user_token: str, raw_name: str) -> Company:
        user = self.get_user_by_token(user_token)

        if self.user_has_company(user.id):
            raise HTTPException(status_code=400, detail="Du besitzt bereits eine Gesellschaft.")

        name = self.normalize_name(raw_name)
        self.validate_name(name)

        if self.company_name_exists(name):
            raise HTTPException(status_code=400, detail=NAME_EXISTS_MSG)

        company = Company(name=name, capital=4_000_000)
        self.db.add(company)

        try:
            # erzeugt company.id ohne Commit
            self.db.flush()

            link = CompanyUserLink(user_id=user.id, company_id=company.id, is_owner=True)
            self.db.add(link)

            self.db.commit()
            self.db.refresh(company)
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=NAME_EXISTS_MSG)

        link = CompanyUserLink(user_id=user.id, company_id=company.id, is_owner=True)
        self.db.add(link)

        try:
            self.db.commit()
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(status_code=400, detail="Du besitzt bereits eine Gesellschaft.")

        return company
