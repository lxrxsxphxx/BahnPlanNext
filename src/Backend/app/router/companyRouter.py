from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app import database, auth
from app.schemas.companySchema import CompanyCreateRequest, CompanyCreateResponse
from app.schemas.vehicleSchema import CompanyVehicleOut
from app.services.companyService import CompanyService
from app.services.vehicleService import VehicleService


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


@router.get("/users/company/vehicles", response_model=List[CompanyVehicleOut])
def get_company_vehicles(
    claims: dict = Depends(auth.check_active),
    company_service: CompanyService = Depends(get_company_service),
    vehicle_service: VehicleService = Depends(get_vehicle_service),
):
    user = company_service.get_user_from_claims(claims)
    if not user.companies:
        raise HTTPException(status_code=404, detail="Nutzer ist in keiner Gesellschaft")

    company_id = user.companies[0].id
    vehicles = vehicle_service.get_vehicles_by_company(company_id)
    return vehicles

