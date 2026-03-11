from typing import List

from fastapi.exceptions import HTTPException
from sqlmodel import Session, exists, select

from app.models.route import Route
from app.models.tender import Contract, Tender
from app.schemas.tenderSchema import OpenTenderOut


class TenderService:
    def __init__(self, db: Session):
        """
        :param session: SQLAlchemy Session
        """
        self.db = db

    def get_open_tenders(self) -> List[OpenTenderOut]:
        contract = select(1).select_from(Contract).where(Contract.tender_id == Tender.id)
        stmt = select(Tender, Route).join(Route).where(~exists(contract)).order_by(Tender.contract_start_monday)
        # über Datum, difficulty und oder Name sortieren?
        open_tenders = self.db.exec(stmt).all()

        return [
            OpenTenderOut(
                id=tender.id,
                name=tender.name,
                description=tender.description,
                difficulty=tender.difficulty,
                route=route.name,# route name oder complexere Anfrage?
                contract_start=tender.contract_start_monday,
            )
            for tender, route in open_tenders
        ]
