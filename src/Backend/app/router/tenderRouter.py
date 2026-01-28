from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette.responses import HTMLResponse

from app import auth, database
from app.schemas.tenderSchema import OpenTenderOut
from app.services.tenderService import TenderService

router = APIRouter(tags=["Ausschreibungen"])

def get_tender_service(db: Session = Depends(database.get_db)):
    return TenderService(db)

@router.get("/tender/open", response_model=List[OpenTenderOut])
def get_open_tenders(
    claims: dict = Depends(auth.check_active),
    service: TenderService = Depends(get_tender_service)
):
    return service.get_open_tenders()
