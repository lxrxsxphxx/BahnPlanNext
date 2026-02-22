from datetime import datetime, date
from typing import Optional

from pydantic import BaseModel

from enums.vehicle_delivery_status import VehicleDeliveryStatus
from models import VehicleTypeDetails


class CompanyCreateRequest(BaseModel):
    name: str

class CompanyCreateResponse(BaseModel):
    id: int
    name: str
    capital: int

class CompanyVehicleResponse(BaseModel):
    vehicle_number: int
    id: int
    type_id: int
    owner_company_id: int
    type: VehicleTypeDetails
    delivery_status: VehicleDeliveryStatus
    delivery_end_at: datetime
    delivered_at: datetime
    condition_percent: float
    acquired_at: datetime
    is_leased: bool
    leasing_model: Optional[int] = None
    lease_start: Optional[date] = None
    lease_annual_rate_percent: Optional[float] = None
    lease_weekly_rate_percent: Optional[float] = None
