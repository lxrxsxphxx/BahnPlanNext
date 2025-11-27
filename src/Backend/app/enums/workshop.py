from enum import Enum


class WorkshopType(str, Enum):
  """
  bw: Betriebswerk (depot) - A Repair-Station for every type of repair
  aw: Ausbesserungswerk (repair Station) - A Station for smaller types of repair/refuel
  """
  bw = "bw"
  aw = "aw"
