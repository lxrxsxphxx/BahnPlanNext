from typing import List
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette.responses import HTMLResponse

from app import auth
from app import database
from app.services.wagonService import WagonService

router = APIRouter(tags=["Fahrzeuge"])

def get_wagon_service(db: Session = Depends(database.get_db)):
    return WagonService(db)

@router.get("/wagons")
def get_all_wagons(service: WagonService = Depends(get_wagon_service)):
    return service.get_all_wagons()
