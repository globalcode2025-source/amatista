"""replace ingresos with sale line items

Revision ID: 0006_ventas_lineas
Revises: 0005_pedido_cleanup
"""

from alembic import op
import sqlalchemy as sa

revision = "0006_ventas_lineas"
down_revision = "0005_pedido_cleanup"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "lineas_venta",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("pedido_id", sa.String(length=40), sa.ForeignKey("pedidos.id", ondelete="CASCADE"), nullable=False),
        sa.Column("producto_id", sa.String(length=40), sa.ForeignKey("productos.id"), nullable=False),
        sa.Column("precio_unitario", sa.Float(), nullable=False),
        sa.Column("cantidad", sa.Integer(), nullable=False),
        sa.Column("subtotal", sa.Float(), nullable=False),
    )
    op.create_index("ix_lineas_venta_pedido_id", "lineas_venta", ["pedido_id"])
    op.create_index("ix_lineas_venta_producto_id", "lineas_venta", ["producto_id"])
    op.drop_table("ingresos")


def downgrade() -> None:
    op.create_table("ingresos", sa.Column("id", sa.String(length=40), primary_key=True), sa.Column("fecha", sa.Date(), nullable=False), sa.Column("concepto", sa.String(length=150), nullable=False), sa.Column("categoria", sa.String(length=100), nullable=False), sa.Column("monto", sa.Float(), nullable=False), sa.Column("metodoPago", sa.String(length=80), nullable=False))
    op.drop_index("ix_lineas_venta_producto_id", table_name="lineas_venta")
    op.drop_index("ix_lineas_venta_pedido_id", table_name="lineas_venta")
    op.drop_table("lineas_venta")
