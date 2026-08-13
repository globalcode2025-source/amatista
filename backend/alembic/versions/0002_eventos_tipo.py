"""add media type to events

Revision ID: 0002_eventos_tipo
Revises: 0001_initial_schema
Create Date: 2026-08-12
"""

from alembic import op
import sqlalchemy as sa

revision = "0002_eventos_tipo"
down_revision = "0001_initial_schema"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("eventos") as batch_op:
        batch_op.add_column(sa.Column("tipo", sa.String(length=20), nullable=False, server_default="Imagen"))


def downgrade() -> None:
    with op.batch_alter_table("eventos") as batch_op:
        batch_op.drop_column("tipo")
