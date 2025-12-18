from pydantic import BaseModel

class CompanyCreateRequest(BaseModel):
    name: str

class CompanyCreateResponse(BaseModel):
    id: int
    name: str
    capital: int
