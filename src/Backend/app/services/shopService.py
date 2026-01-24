from __future__ import annotations

from datetime import date, datetime
from typing import Optional
from fastapi import HTTPException
from sqlmodel import Session, select
from sqlalchemy import or_, func, cast, Integer
from sqlalchemy.exc import SQLAlchemyError

from app.models.vehicle import (
    VehicleType,
    Vehicle,
    VehicleTypeDetails,
    VehicleTypeCouplingLink,
)
from app.models.company import Company
from app.enums.vehicle import VehicleKind

LEASING_MODELS = {
    1: {"down_payment_pct": 0.10, "annual_rate_percent": 6.0, "weekly_rate_percent": 0.12},
    2: {"down_payment_pct": 0.20, "annual_rate_percent": 5.0, "weekly_rate_percent": 0.10},
    3: {"down_payment_pct": 0.30, "annual_rate_percent": 4.0, "weekly_rate_percent": 0.08},
    4: {"down_payment_pct": 0.40, "annual_rate_percent": 3.0, "weekly_rate_percent": 0.06},
}
SHOP_KINDS: tuple[VehicleKind, ...] = (VehicleKind.locomotive, VehicleKind.multiple_unit)


class ShopService:
    def __init__(self, db: Session):
        self.db = db

    # LISTE (mit Filter)
    def list_vehicle_types(
        self,
        kind: Optional[VehicleKind] = None,
        q: Optional[str] = None,
        only_shop_kinds: bool = True,
    ) -> list[tuple[VehicleType, Optional[VehicleTypeDetails]]]:
        # Join auf Details, damit Listen-Views (Shop) image_key & Stock ohne N+1 liefern können
        stmt = (
            select(VehicleType, VehicleTypeDetails)
            .join(
                VehicleTypeDetails,
                VehicleTypeDetails.vehicle_type_id == VehicleType.id,
                isouter=True,
            )
        )

        if only_shop_kinds:
            stmt = stmt.where(VehicleType.kind.in_(SHOP_KINDS))

        if kind is not None:
            stmt = stmt.where(VehicleType.kind == kind)

        if q is not None and q.strip():
            q = q.strip()
            like = f"%{q}%"
            stmt = stmt.where(or_(VehicleType.name.ilike(like), VehicleType.name.ilike(like)))

        stmt = stmt.order_by(VehicleType.kind, VehicleType.name)
        return list(self.db.exec(stmt).all())

    def get_vehicle_type_details(self, type_id: int):
        # 1) Typ + Details
        stmt = (
            select(VehicleType, VehicleTypeDetails)
            .join(VehicleTypeDetails, VehicleTypeDetails.vehicle_type_id == VehicleType.id, isouter=True)
            .where(VehicleType.id == type_id)
            .where(VehicleType.kind.in_(SHOP_KINDS))
        )
        row = self.db.exec(stmt).first()
        if not row:
            raise HTTPException(status_code=404, detail="Fahrzeugtyp nicht gefunden.")
        vt, details = row

        # 2) kompatible Namen
        compat_stmt = (
            select(VehicleType.name)
            .join(VehicleTypeCouplingLink, VehicleTypeCouplingLink.right_type_id == VehicleType.id)
            .where(VehicleTypeCouplingLink.left_type_id == type_id)
            .order_by(VehicleType.name)
        )
        compatible_names = self.db.exec(compat_stmt).all()

        return vt, details, compatible_names

    # TODO(CELERY): Wöchentliche Leasingrate (lease_weekly_rate_percent) wird über Scheduler/Celery abgebucht. Hier nur Anzahlung + Vertragsstart.
    # außerdem: Liefer-/Statuslogik (in Lieferung -> einsatzbereit)
    def lease_vehicle_type(self, company: Company, type_id: int, leasing_model: int) -> Vehicle:
        if leasing_model not in LEASING_MODELS:
            raise HTTPException(status_code=400, detail="Ungültiges Leasingmodell")

        vt = self.db.exec(select(VehicleType).where(VehicleType.id == type_id)).first()
        if not vt:
            raise HTTPException(status_code=404, detail="Fahrzeugtyp nicht gefunden.")

        details = self.db.exec(select(VehicleTypeDetails).where(VehicleTypeDetails.vehicle_type_id == vt.id)).first()

        if not details:
            raise HTTPException(status_code=500, detail="Fahrzeugdetails nicht vorhanden -> Bestand kann nicht geprüft werden.")

        if details.available_stock is None:
            raise HTTPException(status_code=500, detail="Bestand für diesen Fahrzeugtyp ist nicht definiert.")

        if details.available_stock <= 0:
            raise HTTPException(status_code=409, detail="Dieser Fahrzeugtyp ist aktuell nicht verfügbar.")

        if vt.kind not in SHOP_KINDS:
            raise HTTPException(status_code=400, detail="Dieser Fahrzeugtyp ist nicht im Shop leasebar.")

        m = LEASING_MODELS[leasing_model]
        down_payment = int(vt.new_price * m["down_payment_pct"])

        if company.capital < down_payment:
            raise HTTPException(status_code=400, detail="Nicht genügend Guthaben für die Anzahlung.")

        company.capital -= down_payment
        self.db.add(company)

        details.available_stock -= 1
        self.db.add(details)

        next_no = self.db.exec(
            select(func.coalesce(func.max(cast(Vehicle.vehicle_number, Integer)), 0) + 1)
        ).one()

        vehicle_number = str(next_no)


        v = Vehicle(
            vehicle_number=vehicle_number,
            type_id=vt.id,
            owner_company_id=company.id,
            is_leased=True,
            leasing_model=leasing_model,
            lease_start=date.today(),
            lease_annual_rate_percent=m["annual_rate_percent"],
            lease_weekly_rate_percent=m["weekly_rate_percent"],
            acquired_at=datetime.utcnow(),
        )
        self.db.add(v)

        try:
            self.db.commit()
            self.db.refresh(v)
        except SQLAlchemyError:
            self.db.rollback()
            raise HTTPException(status_code=500, detail="Leasing konnte nicht gespeichert werden (DB-Fehler).")

        return v
