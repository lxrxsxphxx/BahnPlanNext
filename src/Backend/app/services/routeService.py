from uuid import UUID
from sqlmodel import Session, select
from fastapi import HTTPException

from app.models.route import Route
from app.models.station import Station
from app.models.route_stop import RouteStop

class RouteService:
    def __init__(self, db: Session):
        self.db = db

    def get_route_detail(self, route_uuid: UUID):
        route = self.db.exec(select(Route).where(Route.uuid == route_uuid)).first()
        if not route:
            raise HTTPException(status_code=404, detail="Trasse nicht gefunden.")

        rows = self.db.exec(
            select(RouteStop, Station)
            .join(Station, Station.id == RouteStop.station_id)
            .where(RouteStop.route_id == route.id)
            .order_by(RouteStop.seq)
        ).all()

        def t(x):
            return x.strftime("%H:%M") if x else None

        stops = []
        for rs, st in rows:
            stops.append({
                "seq": rs.seq,                                                      # Reihenfolge Nummer
                "station_id": st.id,                                                # Station ID
                "station_name": st.name,                                            # Station Name
                "km": rs.km,                                                        # Zurückgelegte Kilometer
                "arr_a": t(rs.arr_a),                                               # Ankunft A
                "dep_a": t(rs.dep_a),                                               # Abfahrt A
                "arr_b": t(rs.arr_b),                                               # Ankunft B
                "dep_b": t(rs.dep_b),                                               # Abfahrt B
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


    # Genauere Info : https://web.archive.org/web/20150315032038/http://www.bahnplan.de/cms/bp_fv_trassen_details.php?id=291
