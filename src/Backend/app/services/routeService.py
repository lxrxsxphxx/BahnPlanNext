from typing import List, Dict, Any
from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import aliased
from sqlmodel import Session, select
from fastapi import HTTPException

from app.models.route import Route
from app.models.station import Station
from app.models.route_stop import RouteStop

class RouteService:
    def __init__(self, db: Session):
        self.db = db

    def _time(self, x):
        return x.strftime("%H:%M") if x else None

    def get_route_detail(self, route_uuid: UUID):
        # Genauere Info : https://web.archive.org/web/20150315032038/http://www.bahnplan.de/cms/bp_fv_trassen_details.php?id=291
        route = self.db.exec(select(Route).where(Route.uuid == route_uuid)).first()
        if not route:
            raise HTTPException(status_code=404, detail="Trasse nicht gefunden.")

        rows = self.db.exec(
            select(RouteStop, Station)
            .join(Station, Station.id == RouteStop.station_id)
            .where(RouteStop.route_id == route.uuid)
            .order_by(RouteStop.seq)
        ).all()

        stops = []
        for rs, st in rows:
            stops.append({
                "seq": rs.seq,                                                      # Reihenfolge Nummer
                "station_id": st.id,                                                # Station ID
                "station_name": st.name,                                            # Station Name
                "km": rs.km,                                                        # Zurückgelegte Kilometer
                "arr_a": self._time(rs.arr_a),                                               # Ankunft A
                "dep_a": self._time(rs.dep_a),                                               # Abfahrt A
                "arr_b": self._time(rs.arr_b),                                               # Ankunft B
                "dep_b": self._time(rs.dep_b),                                               # Abfahrt B
            })

        return {
            "uuid": str(route.uuid),                                                # UUID
            "name": route.name,                                                     # Name der Route
            "start_station_id": route.start_station_id,                             # ID - Startbahnhof
            "end_station_id": route.end_station_id,                                 # ID - Endbahnhof
            "distance_km": route.distance_km,                                       # Trassenlänge

            "track_type": route.track_type,                                         # Trassenart
            "min_service_percent": route.min_service_percent,                       # Trassenart
            "min_trips_per_week_dir": route.min_trips_per_week_dir,
            "service_speed_kmh": route.service_speed_kmh,                           # Bediengeschwindigkeit
            "max_train_length_wagons": route.max_train_length_wagons,               # maximale Zuglänge
            "capacity_recommendation_seats": route.capacity_recommendation_seats,   # Kapazitätsempfehlung
            "cost_per_trip_eur": route.cost_per_trip_eur,                           # Trassenkosten je Fahrt

            "fahrzeugtypen": {                                                      # Einsetzbare Fahrzeugtypen
                "IR_WAGEN": route.allow_ir,                                         # IR-Wagen
                "IC_WAGEN": route.allow_ic,                                         # IC-Wagen
                "ICE_ZUEGE": route.allow_ice,                                       # ICE-Züge
            },
            "special_notes": route.special_notes,                                   # Besonderheiten der Trasse

            "stops": stops,
        }


    def get_all_routes(self) -> List[Dict[str, Any]]:
        StartStation = aliased(Station)
        EndStation = aliased(Station)

        # gets stop-count & Start/End-Names & routes
        stop_counts = (
            select(
                RouteStop.route_id.label("route_id"),
                func.count(RouteStop.id).label("stop_count"),
            )
            .group_by(RouteStop.route_id)
            .subquery()
        )

        stmt = (
            select(
                Route,
                StartStation.name.label("start_station_name"),
                EndStation.name.label("end_station_name"),
                func.coalesce(stop_counts.c.stop_count, 0).label("stop_count"),
            )
            .join(StartStation, StartStation.id == Route.start_station_id)
            .join(EndStation, EndStation.id == Route.end_station_id)
            .outerjoin(stop_counts, stop_counts.c.route_id == Route.uuid)
            .order_by(Route.name)
        )

        rows = self.db.exec(stmt).all()
        if not rows:
            return []

        # get route-ids
        route_ids = [route.uuid for route, _, _, _ in rows if
                     route.uuid is not None]

        # get all stops & Station-names
        stop_rows = self.db.exec(
            select(RouteStop, Station)
            .join(Station, Station.id == RouteStop.station_id)
            .where(RouteStop.route_id.in_(route_ids))
            .order_by(RouteStop.route_id, RouteStop.seq)
        ).all()

        # group Stops per route
        stops_by_route_id: Dict[int, List[Dict[str, Any]]] = {}
        for rs, st in stop_rows:
            stops_by_route_id.setdefault(rs.route_id, []).append({
                "seq": rs.seq,
                "station_id": st.id,
                "station_name": st.name,
                "km": rs.km,
                "arr_a": self._time(rs.arr_a),
                "dep_a": self._time(rs.dep_a),
                "arr_b": self._time(rs.arr_b),
                "dep_b": self._time(rs.dep_b),
            })


        result: List[Dict[str, Any]] = []
        for route, start_name, end_name, stop_count in rows:
            stops = stops_by_route_id.get(route.uuid, [])

            result.append({
                "uuid": str(route.uuid),
                "name": route.name,
                "start_station_id": route.start_station_id,
                "start_station_name": start_name,
                "end_station_id": route.end_station_id,
                "end_station_name": end_name,
                "distance_km": route.distance_km,
                "track_type": route.track_type,
                "min_service_percent": route.min_service_percent,
                "min_trips_per_week_dir": route.min_trips_per_week_dir,
                "service_speed_kmh": route.service_speed_kmh,
                "max_train_length_wagons": route.max_train_length_wagons,
                "capacity_recommendation_seats": route.capacity_recommendation_seats,
                "cost_per_trip_eur": route.cost_per_trip_eur,

                "vehicletypes": {
                    "IR_ALLOWED": route.allow_ir,
                    "IC_ALLOWED": route.allow_ic,
                    "ICE_ALLOWED": route.allow_ice,
                },
                "special_notes": route.special_notes,

                "stop_count": int(stop_count or 0),
                "stops": stops,
            })

        return result
