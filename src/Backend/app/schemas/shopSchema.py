from pydantic import BaseModel

class ShopVehicleTypeOut(BaseModel):
    id: int
    name: str
    kind: str
    new_price: int
    km_cost: float
    energy_cost_base: float