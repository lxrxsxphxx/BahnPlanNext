from enum import Enum


class VehicleKind(str, Enum):
  locomotive = "locomotive"
  multiple_unit = "multiple_unit"  # Triebwagen
  wagon = "wagon"
