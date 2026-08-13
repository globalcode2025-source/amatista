"""create production costs tables

Revision ID: 0009_costos_produccion
Revises: 0008_proveedores
"""

from alembic import op
import sqlalchemy as sa

revision = "0009_costos_produccion"
down_revision = "0008_proveedores"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table("costos_produccion", sa.Column("id", sa.String(length=40), primary_key=True), sa.Column("producto_id", sa.String(length=40), sa.ForeignKey("productos.id"), nullable=False), sa.Column("fecha", sa.Date(), nullable=False), sa.Column("cantidad_producida", sa.Integer(), nullable=False))
    op.create_index("ix_costos_produccion_producto_id", "costos_produccion", ["producto_id"])
    op.create_table("materiales_costo", sa.Column("id", sa.String(length=40), primary_key=True), sa.Column("costo_produccion_id", sa.String(length=40), sa.ForeignKey("costos_produccion.id", ondelete="CASCADE"), nullable=False), sa.Column("proveedor_id", sa.String(length=40), sa.ForeignKey("proveedores.id"), nullable=False), sa.Column("descripcion", sa.String(length=150), nullable=False), sa.Column("cantidad", sa.String(length=80), nullable=False), sa.Column("valor", sa.Float(), nullable=False))
    op.create_index("ix_materiales_costo_costo_produccion_id", "materiales_costo", ["costo_produccion_id"])
    op.create_index("ix_materiales_costo_proveedor_id", "materiales_costo", ["proveedor_id"])


def downgrade() -> None:
    op.drop_table("materiales_costo")
    op.drop_table("costos_produccion")
