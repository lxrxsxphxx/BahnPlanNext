from typing import List
from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import os

from app import auth
from app import database
from app.schemas.userSchema import UserSchema
from app.services.userService import UserService

router = APIRouter(tags=["User"])

def get_user_service(db: Session = Depends(database.get_db)):
    return UserService(db)

@router.post("/register")
def register_user(
    user: UserSchema,
    service: UserService = Depends(get_user_service)):
    return service.register_user(user)


@router.post("/login")
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    service: UserService = Depends(get_user_service)):
    
    result = service.login(form_data)
    token = result["access_token"]

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        path="/"
    )

    return {"message": "Login erfolgreich"}

@router.get("/users")
def get_all_users(service: UserService = Depends(get_user_service)):
    return service.get_all_users()


@router.get("/login/{username}/{password}")
def login_get(
    username: str,
    password: str,
    response: Response,
    service: UserService = Depends(get_user_service)):
    """
    Development only: Simple GET login endpoint for testing.
    For production, use POST with form data.
    """
    from fastapi.security import OAuth2PasswordRequestForm
    
    # Create form data manually for GET endpoint
    form_data = OAuth2PasswordRequestForm(username=username, password=password)
    
    result = service.login(form_data)
    token = result["access_token"]

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        path="/"
    )

    return {"message": "Login erfolgreich", "access_token": token, "token_type": "bearer"}
@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    return {"message": "Logout erfolgreich"}


@router.get("/verify/{token}")
def verify_user(token: str, service: UserService = Depends(get_user_service)):
    result = service.verify_user(token)
    return result

@router.get("/secured", dependencies=[Depends(auth.check_active)])
def get_all_users_secured(service: UserService = Depends(get_user_service)):
    return service.get_users()


@router.get("/adminsonly", dependencies=[Depends(auth.check_admin)])
def get_all_users_admins_only(service: UserService = Depends(get_user_service)):
    return service.get_users()

@router.get("/users/me/company")
def check_my_company(
    claims: dict = Depends(auth.check_active),
    service: UserService = Depends(get_user_service),
):
    return service.is_user_in_company_by_username(claims["username"])  


@router.post("/dev/create-test-user")
@router.get("/dev/create-test-user")
def create_test_user(service: UserService = Depends(get_user_service)):
    """
    Development endpoint to create an active test user with a company.
    Remove this in production!
    """
    from app.schemas.userSchema import UserSchema
    from app.models.company import Company, CompanyUserLink
    
    # Check if test user already exists
    existing = service.get_user_by_username("testuser")
    if existing:
        return {"message": "Test user already exists", "username": "testuser"}
    
    # Create active test user
    test_user = UserSchema(
        email="test@example.com",
        username="testuser",
        password="test123456",
        role="admin"
    )
    
    from app.models.user import User
    hashed_password = auth.create_password_hash(test_user.password)
    db_user = User(
        email=test_user.email,
        username=test_user.username,
        role=test_user.role,
        hashed_password=hashed_password,
        is_active=True  # Auto-activate for dev
    )
    
    db = service.db
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create a test company
    test_company = Company(
        name="Test Company",
        capital=4_000_000  # Default starting capital
    )
    db.add(test_company)
    db.commit()
    db.refresh(test_company)
    
    # Link user to company as owner
    link = CompanyUserLink(
        user_id=db_user.id,
        company_id=test_company.id,
        is_owner=True
    )
    db.add(link)
    db.commit()
    
    return {
        "message": "Test user created and activated with company",
        "username": "testuser",
        "password": "test123456",
        "email": "test@example.com",
        "company": test_company.name,
        "company_id": test_company.id
    }


@router.post("/dev/add-test-company")
@router.get("/dev/add-test-company")
def add_test_company(service: UserService = Depends(get_user_service)):
    """
    Development endpoint to add a company to the existing test user.
    Remove this in production!
    """
    from app.models.company import Company, CompanyUserLink
    
    # Get test user
    test_user = service.get_user_by_username("testuser")
    if not test_user:
        return {"error": "Test user does not exist. Create it first with /dev/create-test-user"}
    
    # Check if user already has companies
    if test_user.companies:
        return {
            "message": "Test user already has a company",
            "username": "testuser",
            "companies": [{"id": c.id, "name": c.name} for c in test_user.companies]
        }
    
    db = service.db
    
    # Create a test company
    test_company = Company(
        name="Test Company",
        capital=4_000_000  # Default starting capital
    )
    db.add(test_company)
    db.commit()
    db.refresh(test_company)
    
    # Link user to company as owner
    link = CompanyUserLink(
        user_id=test_user.id,
        company_id=test_company.id,
        is_owner=True
    )
    db.add(link)
    db.commit()
    
    return {
        "message": "Test company created and linked to testuser",
        "username": "testuser",
        "company": test_company.name,
        "company_id": test_company.id
    }
