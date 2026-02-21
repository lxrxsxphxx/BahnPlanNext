"""added vehicle_number to Vehicle Model

Revision ID: fbc08c12e7c8
Revises:
Create Date: 2025-12-21 19:30:38.921475
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "fbc08c12e7c8"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("vehicles", sa.Column("vehicle_number", sa.String(), nullable=True))
    op.create_index("ix_vehicles_vehicle_number", "vehicles", ["vehicle_number"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_vehicles_vehicle_number", table_name="vehicles")
    op.drop_column("vehicles", "vehicle_number")
