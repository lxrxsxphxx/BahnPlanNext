from typing import List
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette.responses import HTMLResponse

from app import auth
from app import database
from app.schemas.userSchema import UserSchema
from app.services.userService import UserService

router = APIRouter(tags=["users"])

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


@router.get("/verify/{token}", response_class=HTMLResponse)
def verify_user(token: str, service: UserService = Depends(get_user_service)):
    return service.verify_user(token)


@router.get("/secured", dependencies=[Depends(auth.check_active)])
def get_all_users_secured(service: UserService = Depends(get_user_service)):
    return service.get_users()


@router.get("/adminsonly", dependencies=[Depends(auth.check_admin)])
def get_all_users_admins_only(service: UserService = Depends(get_user_service)):
    return service.get_users()

@router.get("/users/{user_token}/company")
def check_user_company(user_token: str, service: UserService = Depends(get_user_service)):
    return service.is_user_in_company(user_token)
