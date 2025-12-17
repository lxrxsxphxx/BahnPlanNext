from typing import List, Optional, Sequence

from jose import JWTError

from app.models.vehicle import Vehicle
from app import database
from app import auth
from fastapi import HTTPException
from fastapi.responses import HTMLResponse
from sqlmodel import Session, select


class VehicleService:
    def __init__(self, db: Session):
        """
        :param session: SQLAlchemy Session
        """
        self.db = db

    def get_all_vehicles(self):
        vehicles = self.db.exec(select(Vehicle)).all()

        for vehicle in vehicles:
            pass

