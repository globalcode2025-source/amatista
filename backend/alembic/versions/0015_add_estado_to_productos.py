"""add estado field to productos

Revision ID: 0015_add_estado_to_productos
Revises: 0014_client_email
"""

from alembic import op
import sqlalchemy as sa

revision = "0015_add_estado_to_productos"
down_revision = "0014_client_email"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("productos", sa.Column("estado", sa.String(20), nullable=False, server_default="Activo"))


def downgrade() -> None:
    op.drop_column("productos", "estado")
