from sqlmodel import Session, select

from app.models.vehicle import Vehicle


class WagonService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_wagons(self):
        query = select(Vehicle).where(
            Vehicle.type.has(kind="wagon")
        )

        wagons = self.db.exec(query).all()
        return wagons



