from typing import List
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import os

from app import auth
from app import database
from app.schemas.userSchema import UserSchema
from app.services.userService import UserService

router = APIRouter(tags=["User"])

def get_user_service(db: Session = Depends(database.get_db)):
    return UserService(db)


@router.get("/users")
def get_all_users(service: UserService = Depends(get_user_service)):
    return service.get_all_users()


@router.post("/register")
def register_user(
    user: UserSchema,
    service: UserService = Depends(get_user_service)):
    return service.register_user(user)


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    service: UserService = Depends(get_user_service)):
    return service.login(form_data)


@router.get("/verify/{token}")
def verify_user(token: str, service: UserService = Depends(get_user_service)):
    service.verify_user(token)

    frontend_base = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173")
    return RedirectResponse(
        url=f"{frontend_base}/login?verified=1",
        status_code=302
    )


@router.get("/secured", dependencies=[Depends(auth.check_active)])
def get_all_users_secured(service: UserService = Depends(get_user_service)):
    return service.get_users()


@router.get("/adminsonly", dependencies=[Depends(auth.check_admin)])
def get_all_users_admins_only(service: UserService = Depends(get_user_service)):
    return service.get_users()

@router.get("/users/{user_token}/company")
def check_user_company(user_token: str, service: UserService = Depends(get_user_service)):
    return service.is_user_in_company(user_token)
