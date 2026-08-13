"""remove obsolete order quantity and description

Revision ID: 0005_pedido_cleanup
Revises: 0004_asistente_cliente
Create Date: 2026-08-12
"""

from alembic import op
import sqlalchemy as sa


revision = "0005_pedido_cleanup"
down_revision = "0004_asistente_cliente"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_column("pedidos", "cantidad")
    op.drop_column("pedidos", "descripcion")


def downgrade() -> None:
    op.add_column("pedidos", sa.Column("cantidad", sa.Integer(), nullable=False, server_default="1"))
    op.add_column("pedidos", sa.Column("descripcion", sa.Text(), nullable=False, server_default="Pedido"))
