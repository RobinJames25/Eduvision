"""init tables

Revision ID: 9c99e5e99b51
Revises: 691650505d3e
Create Date: 2025-11-18 11:25:57.437328

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9c99e5e99b51'
down_revision: Union[str, None] = '691650505d3e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
