from fastapi import APIRouter, Depends
from sqlmodel import Session

from app import auth, database
from app.services.shopService import ShopService
from app.schemas.shopSchema import ShopVehicleTypeOut

router = APIRouter(prefix="/shop", tags=["Shop"])

def get_shop_service(db: Session = Depends(database.get_db)):
    return ShopService(db)

@router.get("/locomotives", response_model=list[ShopVehicleTypeOut])
def list_locomotives(
    claims: dict = Depends(auth.check_active),
    service: ShopService = Depends(get_shop_service),
):
    # claims wird hier noch nicht genutzt, aber erzwingt "active user"
    return service.list_locomotive_types()
