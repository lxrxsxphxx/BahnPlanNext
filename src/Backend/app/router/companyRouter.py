from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app import database, auth
from app.schemas.companySchema import CompanyCreateRequest, CompanyCreateResponse
from app.services.companyService import CompanyService

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
