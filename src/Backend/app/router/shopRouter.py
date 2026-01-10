from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app import auth, database
from app.enums.vehicle import VehicleKind
from app.schemas.shopSchema import (
    ShopVehicleTypeOut,
    ShopVehicleTypeDetailsOut,
    LeaseRequest,
    LeasedVehicleOut,
)
from app.services.shopService import ShopService
from app.services.userService import UserService

router = APIRouter(prefix="/shop", tags=["Shop"])

def get_shop_service(db: Session = Depends(database.get_db)):
    return ShopService(db)

def get_user_service(db: Session = Depends(database.get_db)):
    return UserService(db)


@router.get("/vehicle-types", response_model=list[ShopVehicleTypeOut])
def list_vehicle_types(
    kind: Optional[VehicleKind] = None,
    q: Optional[str] = None,
    claims: dict = Depends(auth.check_active),
    service: ShopService = Depends(get_shop_service),
):
    # claims wird (noch) nicht genutzt, erzwingt aber "active user"
    types = service.list_vehicle_types(kind=kind, q=q)

    return [
        ShopVehicleTypeOut(
            id=t.id,
            name=t.name,
            kind=t.kind.value,
            new_price=t.new_price,
            km_cost=t.km_cost,
            energy_cost_base=t.energy_cost_base,
        )
        for t in types
    ]


@router.get("/vehicle-types/{type_id}", response_model=ShopVehicleTypeDetailsOut)
def vehicle_type_details(
    type_id: int,
    claims: dict = Depends(auth.check_active),
    service: ShopService = Depends(get_shop_service),
):
    vt, d, compatible_codes = service.get_vehicle_type_details(type_id)

    return ShopVehicleTypeDetailsOut(
        id=vt.id,
        name=vt.name,
        kind=vt.kind.value,

        new_price=vt.new_price,
        km_cost=vt.km_cost,
        energy_cost_base=vt.energy_cost_base,

        traction_type=getattr(d, "traction_type", None),
        suitable_passenger_max_wagons=getattr(d, "suitable_passenger_max_wagons", None),
        suitable_freight_max_tons=getattr(d, "suitable_freight_max_tons", None),
        countries_allowed=getattr(d, "countries_allowed", None),
        power_kw=getattr(d, "power_kw", None),
        max_speed_kmh=getattr(d, "max_speed_kmh", None),
        depot_category=getattr(d, "depot_category", None),
        max_traction_units=getattr(d, "max_traction_units", None),
        image_key=getattr(d, "image_key", None),
        total_stock=getattr(d, "total_stock", None),
        available_stock=getattr(d, "available_stock", None),
        compatible_with=compatible_codes,
    )


@router.post("/vehicle-types/{type_id}/lease", response_model=LeasedVehicleOut)
def lease_vehicle(
    type_id: int,
    body: LeaseRequest,
    claims: dict = Depends(auth.check_active),
    shop: ShopService = Depends(get_shop_service),
    users: UserService = Depends(get_user_service),
):
    # 1) User laden
    user = users.get_user_by_username(claims["username"])
    if not user:
        raise HTTPException(status_code=401, detail="User nicht gefunden.")

    # 2) Company bestimmen (erstmal erste Company)
    if not user.companies:
        raise HTTPException(status_code=400, detail="User ist in keiner Gesellschaft.")
    company = user.companies[0]

    # 3) Leasing durchführen
    v = shop.lease_vehicle_type(
        company=company,
        type_id=type_id,
        leasing_model=body.leasing_model,
    )

    # 4) Response bauen
    return LeasedVehicleOut(
        vehicle_id=v.id,
        type_id=v.type_id,
        owner_company_id=v.owner_company_id,
        is_leased=v.is_leased,
        leasing_model=v.leasing_model,
        lease_start=v.lease_start,
        lease_annual_rate_percent=v.lease_annual_rate_percent,
        lease_weekly_rate_percent=v.lease_weekly_rate_percent,
        acquired_at=v.acquired_at,
    )
