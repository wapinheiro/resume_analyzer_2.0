"""add leaderboard opt in to users table

Revision ID: a1b2c3d4e5f6
Revises: 52b8cfddbe1a
Create Date: 2026-09-17 17:33:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = '7969d5f0b142'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS leaderboard_opt_in BOOLEAN DEFAULT TRUE;")


def downgrade() -> None:
    op.execute("ALTER TABLE users DROP COLUMN IF EXISTS leaderboard_opt_in;")

