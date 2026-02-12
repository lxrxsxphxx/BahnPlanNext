from datetime import date, time

from sqlmodel import Session, select

from app.database import engine
from app.enums.difficulty import Difficulty
from app.models.route import Route
from app.models.route_stop import RouteStop
from app.models.station import Station
from app.models.tender import Tender


def ensure_route(session: Session) -> Route:
    route = session.exec(select(Route)).first()
    if route:
        return route

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

    session.add_all(
        [
            RouteStop(
                route_id=route.uuid,
                station_id=dresden.id,
                seq=1,
                km=0.0,
                dep_a=time(8, 10),
                dep_b=time(18, 10),
            ),
            RouteStop(
                route_id=route.uuid,
                station_id=leipzig.id,
                seq=2,
                km=121.3,
                arr_a=time(9, 0),
                dep_a=time(9, 5),
                arr_b=time(17, 5),
                dep_b=time(17, 10),
            ),
            RouteStop(
                route_id=route.uuid,
                station_id=berlin.id,
                seq=3,
                km=240.865,
                arr_a=time(10, 10),
                arr_b=time(16, 10),
            ),
        ]
    )
    session.commit()
    return route


def main() -> None:
    with Session(engine) as session:
        existing = session.exec(select(Tender.id)).first()
        if existing is not None:
            print("[seed] tenders already exist -> skip")
            return

        route = ensure_route(session)

        session.add_all(
            [
                Tender(
                    name="Ausschreibung 1",
                    route_id=route.uuid,
                    description="Beispiel-Ausschreibung (schwer)",
                    difficulty=Difficulty.hard,
                    contract_start_monday=date(year=2026, month=8, day=3),
                ),
                Tender(
                    name="Ausschreibung 2",
                    route_id=route.uuid,
                    description="Beispiel-Ausschreibung (einfach)",
                    difficulty=Difficulty.easy,
                    contract_start_monday=date(year=2026, month=8, day=24),
                ),
                Tender(
                    name="Ausschreibung 3",
                    route_id=route.uuid,
                    description="Beispiel-Ausschreibung (mittel)",
                    difficulty=Difficulty.medium,
                    contract_start_monday=date(year=2026, month=8, day=10),
                ),
            ]
        )
        session.commit()

    print("[seed] example tenders created")


if __name__ == "__main__":
    main()
