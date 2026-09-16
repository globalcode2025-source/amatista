"""add visibilidad field to eventos

Revision ID: 0016_add_visibilidad_to_eventos
Revises: 0015_add_estado_to_productos
"""

from alembic import op
import sqlalchemy as sa

revision = "0016_add_visibilidad_to_eventos"
down_revision = "0015_add_estado_to_productos"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("eventos", sa.Column("visibilidad", sa.String(20), nullable=False, server_default="Público"))


def downgrade() -> None:
    op.drop_column("eventos", "visibilidad")
