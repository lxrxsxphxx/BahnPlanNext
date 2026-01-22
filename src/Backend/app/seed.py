from datetime import time
from sqlmodel import Session, select
import logging

from app.models.station import Station
from app.models.route import Route
from app.models.route_stop import RouteStop

from app.models.company import Company
from app.models.vehicle import Vehicle, VehicleType


def seed_demo_data(db_generator) -> None:
    """Idempotent: seed nur, wenn noch keine Routes existieren."""

    logger = logging.getLogger("uvicorn")

    try:

        session = next(db_generator)

        # Add a company
        company = Company(name="RailCorp")
        session.add(company)
        session.commit()
        session.refresh(company)

        # Add vehicle type (wagon)
        wagon_type = VehicleType(
            name="Wagon Type A",
            kind="wagon",  # TODO use enum
            new_price=500_000,
            km_cost=2.5,
            energy_cost_base=100.0
        )
        session.add(wagon_type)
        session.commit()
        session.refresh(wagon_type)

        # Add a few vehicles
        for i in range(1, 4):
            vehicle = Vehicle(
                vehicle_number=f"WAGON-00{i}",
                type_id=wagon_type.id,
                owner_company_id=company.id
            )
            session.add(vehicle)
        session.commit()

        if session.exec(select(Route.uuid)).first() is not None:
            print("")
            logger.info("[seed] routes already exist -> skip")
            print("")
            return

        def get_or_create_station(name: str) -> Station:
            st = session.exec(select(Station).where(Station.name == name)).first()
            if st:
                return st
            st = Station(name=name)
            session.add(st)
            session.commit()
            session.refresh(st)
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
        session.add(route)
        session.commit()
        session.refresh(route)

        session.add_all([
            RouteStop(route_id=route.uuid, station_id=dresden.id, seq=1, km=0.0,    dep_a=time(8, 10), dep_b=time(18, 10)),
            RouteStop(route_id=route.uuid, station_id=leipzig.id, seq=2, km=121.3,  arr_a=time(9, 0), dep_a=time(9, 5), arr_b=time(17, 5), dep_b=time(17, 10)),
            RouteStop(route_id=route.uuid, station_id=berlin.id,  seq=3, km=240.865, arr_a=time(10, 10), arr_b=time(16, 10)),
        ])
        session.commit()

        logger.info("[seed] created demo route uuid= %s", route.uuid)
        print("")

    finally:
        session.close()   # close the session
        try:
            next(db_generator)  # properly finish the generator
        except StopIteration:
            pass

