"""remove sale status

Revision ID: 0007_remove_sale_status
Revises: 0006_ventas_lineas
"""

from alembic import op
import sqlalchemy as sa

revision = "0007_remove_sale_status"
down_revision = "0006_ventas_lineas"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_column("pedidos", "estado")


def downgrade() -> None:
    op.add_column("pedidos", sa.Column("estado", sa.String(length=20), nullable=False, server_default="Pendiente"))
