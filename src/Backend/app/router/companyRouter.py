from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app import database
from app.schemas.companySchema import CompanyCreateRequest, CompanyCreateResponse
from app.services.companyService import CompanyService

router = APIRouter(tags=["Company"])

def get_company_service(db: Session = Depends(database.get_db)):
    return CompanyService(db)

@router.post("/users/{user_token}/company", response_model=CompanyCreateResponse)
def create_company(
    user_token: str,
    payload: CompanyCreateRequest,
    service: CompanyService = Depends(get_company_service),
):
    try:
        c = service.create_company(user_token, payload.name)
        return CompanyCreateResponse(id=c.id, name=c.name, capital=c.capital)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
