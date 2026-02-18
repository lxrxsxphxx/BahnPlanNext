from typing import List, Optional, Sequence, Dict, Any

from jose import JWTError

from app.models.vehicle import Vehicle
from app import database
from app import auth
from fastapi import HTTPException
from fastapi.responses import HTMLResponse
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload

from datetime import datetime, timezone
from app.enums.vehicle_delivery_status import VehicleDeliveryStatus


class VehicleService:
    def __init__(self, db: Session):
        """
        :param session: SQLAlchemy Session
        """
        self.db = db

    def get_all_vehicles(self) -> List[Dict[str, Any]]:

        now = datetime.now(timezone.utc)

        # Refresh Lieferstatus
        stmt_due = select(Vehicle).where(
            Vehicle.delivery_status == VehicleDeliveryStatus.in_delivery,
            Vehicle.delivery_end_at.is_not(None),
            Vehicle.delivery_end_at <= now,
        )
        due = self.db.exec(stmt_due).all()

        if due:
            for v in due:
                v.delivery_status = VehicleDeliveryStatus.ready
                v.delivered_at = now
            self.db.commit()

        stmt = select(Vehicle).options(selectinload(Vehicle.type))
        vehicles = self.db.exec(stmt).all()

        grouped: Dict[str, Dict[str, Any]] = {}

        for vehicle in vehicles:
            # Safety: falls type nicht geladen/gesetzt ist
            if vehicle.type is None:
                train_type = "UNKNOWN"
                type_name = None
                type_id = vehicle.type_id
            else:
                train_type = vehicle.type.name  # Enum -> string
                type_name = vehicle.type.name
                type_id = vehicle.type.id

            # Falls Zugart von unseren Enums nicht reicht kann man hier auch noch Logik einbauen oder sogar die DB einbinden, dass sehe ich allerdings hier noch nicht als notwendig.
            group_label = f"{train_type}"
            if group_label not in grouped:
                grouped[group_label] = {
                    "label": group_label,
                    "zugteile": []
                }

            grouped[group_label]["zugteile"].append({
                "zugart": train_type,
                "zugnummer": vehicle.vehicle_number,
                "Details": {
                    "vehicle_type_id": type_id,
                    "vehicle_type_name": type_name,
                    "owner_company_id": vehicle.owner_company_id,
                    "condition_percent": vehicle.condition_percent,
                    "acquired_at": vehicle.acquired_at,
                    "is_leased": vehicle.is_leased,
                    "delivery_status": vehicle.delivery_status,
                    "delivery_end_at": vehicle.delivery_end_at,
                    "delivered_at": vehicle.delivered_at,
                    "leasing_model": vehicle.leasing_model,
                    "lease_start": vehicle.lease_start,
                    "lease_annual_rate_percent": vehicle.lease_annual_rate_percent,
                    "lease_weekly_rate_percent": vehicle.lease_weekly_rate_percent,
                },
            })

        return list(grouped.values())

