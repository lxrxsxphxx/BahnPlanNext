from docker.api import service
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app import database, auth
from app.schemas.companySchema import CompanyCreateRequest, CompanyCreateResponse
from app.services.companyService import CompanyService

from schemas.companySchema import CompanyVehicleResponse

router = APIRouter(tags=["Company"])

def get_company_service(db: Session = Depends(database.get_db)):
    return CompanyService(db)

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
                         service: CompanyService = Depends(get_company_service)):
    """
    returns company vehicles for the given CompanyName
    :param claims: dict
    :param service: CompanyService
    :return: List[CompanyVehicleResponse]
    """
    return service.get_company_vehicles(claims)
