"""add difficulty to tenders

Revision ID: 250204_add_diff
Revises: fbc08c12e7c8
Create Date: 2026-02-04 13:15:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "250204_add_diff"
down_revision: Union[str, Sequence[str], None] = "fbc08c12e7c8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    difficulty_enum = sa.Enum("easy", "medium", "hard", name="difficulty")
    difficulty_enum.create(op.get_bind(), checkfirst=True)

    op.add_column(
        "tenders",
        sa.Column(
            "difficulty",
            difficulty_enum,
            nullable=False,
            server_default="easy",
        ),
    )


def downgrade() -> None:
    op.drop_column("tenders", "difficulty")

    difficulty_enum = sa.Enum("easy", "medium", "hard", name="difficulty")
    difficulty_enum.drop(op.get_bind(), checkfirst=True)
