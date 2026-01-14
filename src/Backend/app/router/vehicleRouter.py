from typing import List
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette.responses import HTMLResponse

from app import auth
from app import database
from app.services.vehicleService import VehicleService

router = APIRouter(tags=["Fahrzeuge"])

def get_vehicle_service(db: Session = Depends(database.get_db)):
    return VehicleService(db)

@router.get("/vehicles")
def get_all_vehicles(service: VehicleService = Depends(get_vehicle_service)):
    return service.get_all_vehicles()

