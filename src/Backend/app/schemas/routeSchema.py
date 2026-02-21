from pydantic import BaseModel
from typing import List, Optional, Dict

class RouteStopOut(BaseModel):
    seq: int
    station_id: int
    station_name: str
    km: float
    arr_a: Optional[str] = None
    dep_a: Optional[str] = None
    arr_b: Optional[str] = None
    dep_b: Optional[str] = None

class RouteDetailOut(BaseModel):
    uuid: str
    name: str
    start_station_id: int
    end_station_id: int
    distance_km: float

    track_type: str
    min_service_percent: int
    min_trips_per_week_dir: int
    service_speed_kmh: int
    max_train_length_wagons: int
    capacity_recommendation_seats: int
    cost_per_trip_eur: float

    fahrzeugtypen: Dict[str, bool]
    special_notes: Optional[str] = None

    stops: List[RouteStopOut]
