from typing import List
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette.responses import HTMLResponse

from app import auth
from app import database
from app.services.vehicleService import VehicleSerive

router = APIRouter(tags=["Trassen"])

def get_vehicle_service(db: Session = Depends(database.get_db)):
    return RouteService(db)

@router.get("/trassen")
def get_all_vehicles(service: RouteService = Depends(get_vehicle_service)):
    return service.get_all_vehicles()

