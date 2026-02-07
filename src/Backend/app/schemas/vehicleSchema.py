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
