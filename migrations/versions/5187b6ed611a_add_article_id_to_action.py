"""Add article id to action

Revision ID: 5187b6ed611a
Revises: fe271dd8a07
Create Date: 2015-07-12 13:19:27.955707

"""

# revision identifiers, used by Alembic.
revision = '5187b6ed611a'
down_revision = 'fe271dd8a07'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('action', sa.Column('article_id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'action', 'article', ['article_id'], ['id'])


def downgrade():
    op.drop_constraint(None, 'action', type_='foreignkey')
    op.drop_column('action', 'article_id')
