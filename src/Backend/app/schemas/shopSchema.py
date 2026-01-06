from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class ShopVehicleTypeOut(BaseModel):
    id: int
    name: str
    kind: str
    new_price: int
    km_cost: float
    energy_cost_base: float

class LeaseRequest(BaseModel):
    leasing_model: int

class LeasedVehicleOut(BaseModel):
    vehicle_id: int
    type_id: int
    owner_company_id: int
    is_leased: bool
    leasing_model: int
    lease_start: date
    lease_annual_rate_percent: float
    lease_weekly_rate_percent: float
    acquired_at: datetime 

    from typing import Optional
from pydantic import BaseModel

class ShopLocomotiveDetailsOut(BaseModel):
    id: int
    name: str
    kind: str

    new_price: int
    km_cost: float
    energy_cost_base: float

    traction_type: Optional[str] = None
    suitable_passenger_max_wagons: Optional[int] = None
    suitable_freight_max_tons: Optional[int] = None
    countries_allowed: Optional[str] = None
    power_kw: Optional[int] = None
    max_speed_kmh: Optional[int] = None
    depot_category: Optional[int] = None
    max_traction_units: Optional[int] = None
    image_key: Optional[str] = None
    total_stock: Optional[int] = None
    available_stock: Optional[int] = None
