from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app import database, auth
from app.schemas.companySchema import CompanyCreateRequest, CompanyCreateResponse, CompanyVehicleResponse
from app.schemas.vehicleSchema import CompanyVehicleOut
from app.services.companyService import CompanyService
from app.services.vehicleService import VehicleService


from app.router.userRouter import get_user_service
from app.services.userService import UserService

router = APIRouter(tags=["Company"])

def get_company_service(db: Session = Depends(database.get_db)):
    return CompanyService(db)


def get_vehicle_service(db: Session = Depends(database.get_db)):
    return VehicleService(db)

@router.get("/users/company", response_model=CompanyCreateResponse)
def get_company_info(
    claims: dict = Depends(auth.check_active),
    service: CompanyService = Depends(get_company_service),
):
    company = service.get_company_from_claims(claims)
    if not company:
        raise HTTPException(status_code=404, detail="Nutzer ist in keiner Gesellschaft")
    return CompanyCreateResponse(id=company.id, name=company.name, capital=company.capital)


@router.post("/users/company", response_model=CompanyCreateResponse)
def create_company(
    payload: CompanyCreateRequest,
    claims: dict = Depends(auth.check_active),
    service: CompanyService = Depends(get_company_service),
):
    c = service.create_company(claims, payload.name)
    return CompanyCreateResponse(id=c.id, name=c.name, capital=c.capital)

@router.post("/users/company/vehicles", response_model=CompanyVehicleResponse)
def get_company_vehicles(claims: dict = Depends(auth.check_active),
                         service: CompanyService = Depends(get_company_service),
                         users: UserService = Depends(get_user_service)):
    """
    returns company vehicles for the given CompanyName
    :param claims: dict
    :param service: CompanyService
    :return: List[CompanyVehicleResponse]
    """
    user = users.get_user_by_username(claims["username"])
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    if not user.companies:
        raise HTTPException(status_code=400,
                            detail="User ist in keiner Gesellschaft.")
    company = user.companies[0]

    return service.get_company_vehicles(company)
