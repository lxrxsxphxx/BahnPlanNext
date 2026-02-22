from enum import Enum

class VehicleDeliveryStatus(str, Enum):
    in_delivery = "in_delivery"
    ready = "ready"
