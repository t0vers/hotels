"""add room description field

Revision ID: 0fd4d65c83e4
Revises: 2adcea45e9eb
Create Date: 2024-06-18 22:36:38.532964

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0fd4d65c83e4'
down_revision: Union[str, None] = '2adcea45e9eb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('room', sa.Column('description', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('room', 'description')
    # ### end Alembic commands ###
