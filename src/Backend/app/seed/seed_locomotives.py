import json
from pathlib import Path
from sqlmodel import Session, select, delete

from app.database import engine
from app.models.vehicle import VehicleType, VehicleTypeDetails, VehicleTypeCouplingLink
from app.enums.vehicle import VehicleKind

DATA_PATH = Path(__file__).with_name("locomotives.json")

def upsert_vehicle_type(session: Session, item: dict) -> VehicleType:
    name = item["name"]
    vt = session.exec(select(VehicleType).where(VehicleType.name == name)).first()

    kind = VehicleKind(item["kind"])
    if vt is None:
        vt = VehicleType(
            name=name,
            kind=kind,
            new_price=item["new_price"],
            km_cost=item["km_cost"],
            energy_cost_base=item["energy_cost_base"],
        )
        session.add(vt)
        session.flush()  # vt.id bekommen ohne commit
    else:
        vt.kind = kind
        vt.new_price = item["new_price"]
        vt.km_cost = item["km_cost"]
        vt.energy_cost_base = item["energy_cost_base"]
        session.add(vt)

    return vt

def upsert_vehicle_details(session: Session, vt: VehicleType, details: dict) -> None:
    d = session.exec(
        select(VehicleTypeDetails).where(VehicleTypeDetails.vehicle_type_id == vt.id)
    ).first()

    if d is None:
        d = VehicleTypeDetails(vehicle_type_id=vt.id)
        session.add(d)

    # Felder setzen
    d.traction_type = details.get("traction_type")
    d.suitable_passenger_max_wagons = details.get("suitable_passenger_max_wagons")
    d.suitable_freight_max_tons = details.get("suitable_freight_max_tons")
    d.countries_allowed = details.get("countries_allowed")
    d.power_kw = details.get("power_kw")
    d.max_speed_kmh = details.get("max_speed_kmh")
    d.depot_category = details.get("depot_category")
    d.max_traction_units = details.get("max_traction_units")
    d.image_key = details.get("image_key")
    d.total_stock = details.get("total_stock")
    d.available_stock = details.get("available_stock")

    session.add(d)


def seed_couplings(session: Session, data: list[dict]) -> None:
    """
    Erst NACHDEM alle vehicle_types existieren:
    - mappe name -> id
    - schreibe Links in vehicle_type_coupling_links
    - lege beide Richtungen an (A->B und B->A), damit Abfragen simpel bleiben.
    """
    # optional: Couplings neu aufbauen
    session.exec(delete(VehicleTypeCouplingLink))

    all_types = session.exec(select(VehicleType)).all()
    name_to_id = {t.name: t.id for t in all_types if t.id is not None}

    created = set()  # (left_id, right_id)

    for item in data:
        left_name = item["name"].strip()
        left_id = name_to_id.get(left_name)
        if not left_id:
            continue

        compat_list = item.get("compatible_with") or []
        for right_name in compat_list:
            right_name = str(right_name).strip()
            right_id = name_to_id.get(right_name)

            # Wenn JSON auf einen Typ zeigt, den es nicht gibt: warnen/skip
            if not right_id:
                print(f"[WARN] compatible_with '{right_name}' not found (from '{left_name}')")
                continue

            if left_id == right_id:
                continue

            # beide Richtungen
            pairs = [(left_id, right_id), (right_id, left_id)]
            for a, b in pairs:
                if (a, b) in created:
                    continue
                session.add(VehicleTypeCouplingLink(left_type_id=a, right_type_id=b))
                created.add((a, b))

    print(f"Couplings seeded: {len(created)} directional links")


def main():
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))

    with Session(engine) as session:
        for item in data:
            vt = upsert_vehicle_type(session, item)
            details = item.get("details") or {}
            upsert_vehicle_details(session, vt, details)

        session.commit()

        seed_couplings(session, data)
        session.commit()

    print(f"Seed complete: {len(data)} locomotives processed.")

if __name__ == "__main__":
    main()
