"""add discount dates to productos

Revision ID: 0013_discount_dates
Revises: 0012_add_discount_fields
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import Date

revision = "0013_discount_dates"
down_revision = "0012_add_discount_fields"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("productos", sa.Column("fecha_inicio_descuento", Date(), nullable=True))
    op.add_column("productos", sa.Column("fecha_fin_descuento", Date(), nullable=True))


def downgrade() -> None:
    op.drop_column("productos", "fecha_fin_descuento")
    op.drop_column("productos", "fecha_inicio_descuento")
