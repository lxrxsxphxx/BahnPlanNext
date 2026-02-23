"""add delivery columns to vehicles

Revision ID: 20260222_add_delivery_columns
Revises: 250204_add_diff
Create Date: 2026-02-22 17:30:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "20260222_add_delivery_columns"
down_revision: Union[str, Sequence[str], None] = "250204_add_diff"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add delivery status with default
    op.add_column(
        "vehicles",
        sa.Column(
            "delivery_status",
            sa.String(),
            nullable=False,
            server_default="in_delivery",
        ),
    )
    op.add_column(
        "vehicles",
        sa.Column("delivery_end_at", sa.DateTime(), nullable=True),
    )
    op.add_column(
        "vehicles",
        sa.Column("delivered_at", sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("vehicles", "delivered_at")
    op.drop_column("vehicles", "delivery_end_at")
    op.drop_column("vehicles", "delivery_status")
