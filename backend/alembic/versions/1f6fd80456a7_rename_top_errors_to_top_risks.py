"""rename_top_errors_to_top_risks

Revision ID: 1f6fd80456a7
Revises: cb8536d33cf7
Create Date: 2026-02-18 12:23:44.952501

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1f6fd80456a7'
down_revision: Union[str, None] = 'cb8536d33cf7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Use batch_alter_table for SQLite compatibility
    with op.batch_alter_table('analyses', schema=None) as batch_op:
        batch_op.alter_column('top_errors', new_column_name='top_risks', existing_type=sa.JSON())

def downgrade() -> None:
    with op.batch_alter_table('analyses', schema=None) as batch_op:
        batch_op.alter_column('top_risks', new_column_name='top_errors', existing_type=sa.JSON())
