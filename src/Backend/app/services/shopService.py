from sqlmodel import Session, select

from app.models.vehicle import VehicleType
from app.enums.vehicle import VehicleKind

class ShopService:
    def __init__(self, db: Session):
        self.db = db

    def list_locomotive_types(self):
        stmt = select(VehicleType).where(VehicleType.kind == VehicleKind.locomotive)
        return self.db.exec(stmt).all()