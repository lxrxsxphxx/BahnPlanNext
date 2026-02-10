from datetime import date
from typing import Optional

from pydantic import BaseModel

from app.enums.difficulty import Difficulty


class OpenTenderOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    difficulty: Difficulty

    route: str

    contract_start: Optional[date] = None

    #bids_count: int
