import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import auth, database
from app.schemas.tenderSchema import OpenTenderOut
from app.services.tenderService import TenderService

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Ausschreibungen"])

def get_tender_service(db: Session = Depends(database.get_db)):
    return TenderService(db)

@router.get("/tender/open", response_model=List[OpenTenderOut])
def get_open_tenders(
    claims: dict = Depends(auth.check_active),
    service: TenderService = Depends(get_tender_service)
):
    try:
        return service.get_open_tenders()
    except Exception:
        logger.exception("Getting open Tenders failed")
        raise HTTPException(status_code=500, detail="Interner Server Error")
