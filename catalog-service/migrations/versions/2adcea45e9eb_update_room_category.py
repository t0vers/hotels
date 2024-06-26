"""update room category

Revision ID: 2adcea45e9eb
Revises: 430db2638ba7
Create Date: 2024-06-18 20:23:53.765311

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2adcea45e9eb'
down_revision: Union[str, None] = '430db2638ba7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('category',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('value', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_category_id'), 'category', ['id'], unique=False)
    op.add_column('room', sa.Column('category_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'room', 'category', ['category_id'], ['id'])
    op.drop_column('room', 'room_class')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('room', sa.Column('room_class', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'room', type_='foreignkey')
    op.drop_column('room', 'category_id')
    op.drop_index(op.f('ix_category_id'), table_name='category')
    op.drop_table('category')
    # ### end Alembic commands ###
