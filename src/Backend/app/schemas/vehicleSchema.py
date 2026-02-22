from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date


class CompanyVehicleOut(BaseModel):
    id: int
    vehicle_number: str
    type_id: int
    type_name: Optional[str] = None
    owner_company_id: int
    condition_percent: float
    acquired_at: datetime
    is_leased: bool
    leasing_model: Optional[int] = None
    lease_start: Optional[date] = None
    lease_annual_rate_percent: Optional[float] = None
    lease_weekly_rate_percent: Optional[float] = None
    image_key: Optional[str] = None
    new_price: Optional[float] = None
    km_cost: Optional[float] = None
    energy_cost_base: Optional[float] = None
    traction_type: Optional[str] = None
    suitable_passenger_max_wagons: Optional[int] = None
    suitable_freight_max_tons: Optional[float] = None
    countries_allowed: Optional[str] = None
    power_kw: Optional[float] = None
    max_speed_kmh: Optional[float] = None
    depot_category: Optional[int] = None
    max_traction_units: Optional[int] = None
    compatible_with: Optional[str] = None
