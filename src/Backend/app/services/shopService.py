from sqlmodel import Session, select
from datetime import date
from fastapi import HTTPException

from app.models.vehicle import VehicleType, Vehicle, VehicleTypeDetails
from app.models.company import Company
from app.enums.vehicle import VehicleKind

LEASING_MODELS = {
    1: {"down_payment_pct": 0.10, "annual_rate_percent": 6.0, "weekly_rate_percent": 0.12},
    2: {"down_payment_pct": 0.20, "annual_rate_percent": 5.0, "weekly_rate_percent": 0.10},
    3: {"down_payment_pct": 0.30, "annual_rate_percent": 4.0, "weekly_rate_percent": 0.08},
    4: {"down_payment_pct": 0.40, "annual_rate_percent": 3.0, "weekly_rate_percent": 0.06},
}

class ShopService:
    def __init__(self, db: Session):
        self.db = db

    def list_locomotive_types(self):
        stmt = select(VehicleType).where(VehicleType.kind == VehicleKind.locomotive)
        return self.db.exec(stmt).all()
        
    def get_locomotive_details(self, type_id: int):
        stmt = (
            select(VehicleType, VehicleTypeDetails)
            .join(VehicleTypeDetails, VehicleTypeDetails.vehicle_type_id == VehicleType.id, isouter=True)
            .where(VehicleType.id == type_id)
            .where(VehicleType.kind == VehicleKind.locomotive)
        )
        row = self.db.exec(stmt).first()
        if not row:
            raise HTTPException(status_code=404, detail="Lokomotive nicht gefunden.")

        vt, details = row  # details kann None sein, falls noch nicht befüllt
        return vt, details

    def lease_locomotive(self, company: Company, type_id: int, leasing_model: int) -> Vehicle:
        # 1) Leasingmodell validieren
        if leasing_model not in LEASING_MODELS:
            raise HTTPException(status_code=400, detail="Ungültiges Leasingmodell")

        # 2) VehicleType laden
        vt = self.db.exec(select(VehicleType).where(VehicleType.id == type_id)).first()
        if not vt:
            raise HTTPException(status_code=404, detail="Fahrzeugtyp nicht gefunden.")

        # sicherstellen, dass es wirklich eine Lok ist
        from app.enums.vehicle import VehicleKind
        if vt.kind != VehicleKind.locomotive:
            raise HTTPException(status_code=400, detail="Dieser Fahrzeugtyp ist keine Lokomotive.")

        # 3) Anzahlung berechnen
        m = LEASING_MODELS[leasing_model]
        down_payment = int(vt.new_price * m["down_payment_pct"])

        # 4) Geld prüfen
        if company.capital < down_payment:
            raise HTTPException(status_code=400, detail="Nicht genügend Guthaben für die Anzahlung.")

        # 5) Geld abbuchen
        company.capital -= down_payment
        self.db.add(company)

        # 6) Vehicle anlegen
        v = Vehicle(
            type_id=vt.id,
            owner_company_id=company.id,
            is_leased=True,
            leasing_model=leasing_model,
            lease_start=date.today(),
            lease_annual_rate_percent=m["annual_rate_percent"],
            lease_weekly_rate_percent=m["weekly_rate_percent"],
        )
        self.db.add(v)

        self.db.commit()
        self.db.refresh(v)
        return v
