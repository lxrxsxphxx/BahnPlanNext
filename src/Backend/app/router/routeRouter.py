from uuid import UUID
from fastapi import APIRouter, Depends
from sqlmodel import Session

from app import database
from app.schemas.routeSchema import RouteDetailOut
from app.services.routeService import RouteService

router = APIRouter(tags=["Routes"])

def get_route_service(db: Session = Depends(database.get_db)):
    return RouteService(db)

@router.get("/trasse/{route_uuid}", response_model=RouteDetailOut)
def get_route_detail(route_uuid: UUID, service: RouteService = Depends(get_route_service)):
    return service.get_route_detail(route_uuid)
