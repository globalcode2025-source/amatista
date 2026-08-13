"""create proveedores table

Revision ID: 0008_proveedores
Revises: 0007_remove_sale_status
"""

from alembic import op
import sqlalchemy as sa

revision = "0008_proveedores"
down_revision = "0007_remove_sale_status"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "proveedores",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("nombre_empresa", sa.String(length=150), nullable=False),
        sa.Column("nit", sa.String(length=50), nullable=True),
        sa.Column("direccion", sa.String(length=255), nullable=False),
        sa.Column("celular", sa.String(length=40), nullable=False),
        sa.Column("municipio", sa.String(length=100), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("proveedores")
