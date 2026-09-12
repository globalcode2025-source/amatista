"""add discount fields to productos and eventos

Revision ID: 0012_add_discount_fields
Revises: 0011_consolidate_manual
"""

from alembic import op
import sqlalchemy as sa

revision = "0012_add_discount_fields"
down_revision = "0011_consolidate_manual"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("productos", sa.Column("descuento", sa.Float(), nullable=True))
    op.add_column("productos", sa.Column("precio_descuento", sa.Float(), nullable=True))
    op.add_column("eventos", sa.Column("descuento", sa.Float(), nullable=True))
    op.add_column("eventos", sa.Column("precio_descuento", sa.Float(), nullable=True))


def downgrade() -> None:
    op.drop_column("eventos", "precio_descuento")
    op.drop_column("eventos", "descuento")
    op.drop_column("productos", "precio_descuento")
    op.drop_column("productos", "descuento")
