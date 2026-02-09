from typing import List, Optional, Sequence, Dict, Any

from jose import JWTError

from app.models.vehicle import Vehicle, VehicleType
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

    def get_vehicles_by_company(self, company_id: int) -> List[Dict[str, Any]]:
        """Return a flat list of vehicles owned by a given company."""
        # Eager-load the related VehicleType and its details so frontend gets full specs
        stmt = select(Vehicle).where(Vehicle.owner_company_id == company_id).options(
            selectinload(Vehicle.type).selectinload(VehicleType.details)
        )
        vehicles = self.db.exec(stmt).all()

        result: List[Dict[str, Any]] = []
        for vehicle in vehicles:
            type_name = None
            image_key = None
            type_id = None
            if vehicle.type is not None:
                type_name = vehicle.type.name
                type_id = vehicle.type.id
                # Extract common type-level properties
                try:
                    image_key = getattr(vehicle.type.details, 'image_key', None)
                except Exception:
                    image_key = None

                # Try to collect detailed attributes if available
                try:
                    details = vehicle.type.details
                    new_price = getattr(vehicle.type, 'new_price', None)
                    km_cost = getattr(vehicle.type, 'km_cost', None)
                    energy_cost_base = getattr(vehicle.type, 'energy_cost_base', None)

                    traction_type = getattr(details, 'traction_type', None)
                    suitable_passenger_max_wagons = getattr(details, 'suitable_passenger_max_wagons', None)
                    suitable_freight_max_tons = getattr(details, 'suitable_freight_max_tons', None)
                    countries_allowed = getattr(details, 'countries_allowed', None)
                    power_kw = getattr(details, 'power_kw', None)
                    max_speed_kmh = getattr(details, 'max_speed_kmh', None)
                    depot_category = getattr(details, 'depot_category', None)
                    max_traction_units = getattr(details, 'max_traction_units', None)
                    compatible_with = getattr(details, 'countries_allowed', None)  # placeholder if needed
                except Exception:
                    new_price = km_cost = energy_cost_base = None
                    traction_type = suitable_passenger_max_wagons = suitable_freight_max_tons = None
                    countries_allowed = power_kw = max_speed_kmh = depot_category = None
                    max_traction_units = compatible_with = None

            result.append({
                "id": vehicle.id,
                "vehicle_number": vehicle.vehicle_number,
                "type_id": type_id,
                "type_name": type_name,
                "owner_company_id": vehicle.owner_company_id,
                "condition_percent": vehicle.condition_percent,
                "acquired_at": vehicle.acquired_at,
                "is_leased": vehicle.is_leased,
                "leasing_model": vehicle.leasing_model,
                "lease_start": vehicle.lease_start,
                "lease_annual_rate_percent": vehicle.lease_annual_rate_percent,
                "lease_weekly_rate_percent": vehicle.lease_weekly_rate_percent,
                "image_key": image_key,
                "new_price": locals().get('new_price'),
                "km_cost": locals().get('km_cost'),
                "energy_cost_base": locals().get('energy_cost_base'),
                "traction_type": locals().get('traction_type'),
                "suitable_passenger_max_wagons": locals().get('suitable_passenger_max_wagons'),
                "suitable_freight_max_tons": locals().get('suitable_freight_max_tons'),
                "countries_allowed": locals().get('countries_allowed'),
                "power_kw": locals().get('power_kw'),
                "max_speed_kmh": locals().get('max_speed_kmh'),
                "depot_category": locals().get('depot_category'),
                "max_traction_units": locals().get('max_traction_units'),
                "compatible_with": locals().get('compatible_with'),
            })
            print(f"Processed vehicle {vehicle.id} - type: {type_name}, image_key: {image_key}, details: {locals().get('details')}")
            print("----")
            print("----")
            print(result[-1])  # Print the last added vehicle for debugging

        return result

