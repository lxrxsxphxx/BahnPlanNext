from datetime import time
from sqlmodel import Session, select
import logging

from app.models.station import Station
from app.models.route import Route
from app.models.route_stop import RouteStop


def seed_demo_data(engine) -> None:
    """Idempotent: seed nur, wenn noch keine Routes existieren."""

    logger = logging.getLogger("uvicorn")

    with Session(engine) as db:
        # Schon Daten vorhanden? Dann nix machen.
        if db.exec(select(Route.id)).first() is not None:
            print("")
            logger.info("[seed] routes already exist -> skip")
            print("")
            return

        def get_or_create_station(name: str) -> Station:
            st = db.exec(select(Station).where(Station.name == name)).first()
            if st:
                return st
            st = Station(name=name)
            db.add(st)
            db.commit()
            db.refresh(st)
            return st

        dresden = get_or_create_station("Dresden Hbf")
        leipzig = get_or_create_station("Leipzig Hbf")
        berlin = get_or_create_station("Berlin Hbf")

        route = Route(
            name="Dresden - Berlin",
            start_station_id=dresden.id,
            end_station_id=berlin.id,
            distance_km=240.865,
        )
        db.add(route)
        db.commit()
        db.refresh(route)

        db.add_all([
            RouteStop(route_id=route.id, station_id=dresden.id, seq=1, km=0.0,    dep_a=time(8, 10), dep_b=time(18, 10)),
            RouteStop(route_id=route.id, station_id=leipzig.id, seq=2, km=121.3,  arr_a=time(9, 0), dep_a=time(9, 5), arr_b=time(17, 5), dep_b=time(17, 10)),
            RouteStop(route_id=route.id, station_id=berlin.id,  seq=3, km=240.865, arr_a=time(10, 10), arr_b=time(16, 10)),
        ])
        db.commit()

        logger.info("[seed] created demo route uuid= %s", route.uuid)
        print("")
