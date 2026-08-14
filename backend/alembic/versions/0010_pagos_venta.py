"""create sale payments table

Revision ID: 0010_pagos_venta
Revises: 0009_costos_produccion
"""

from alembic import op
import sqlalchemy as sa

revision = "0010_pagos_venta"
down_revision = "0009_costos_produccion"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "pagos_venta",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("pedido_id", sa.String(length=40), sa.ForeignKey("pedidos.id", ondelete="CASCADE"), nullable=False),
        sa.Column("codigo", sa.String(length=50), nullable=False, unique=True),
        sa.Column("fecha", sa.Date(), nullable=False),
        sa.Column("monto", sa.Float(), nullable=False),
    )
    op.create_index("ix_pagos_venta_pedido_id", "pagos_venta", ["pedido_id"])


def downgrade() -> None:
    op.drop_table("pagos_venta")
