"""link event attendees to clients

Revision ID: 0004_asistente_cliente
Revises: 0003_asistentes_evento
Create Date: 2026-08-12
"""

from alembic import op
import sqlalchemy as sa

revision = "0004_asistente_cliente"
down_revision = "0003_asistentes_evento"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("asistentes_evento", sa.Column("cliente_id", sa.String(length=40), nullable=True))
    op.create_foreign_key("fk_asistentes_evento_cliente", "asistentes_evento", "clientes", ["cliente_id"], ["id"], ondelete="SET NULL")
    op.create_index("ix_asistentes_evento_cliente_id", "asistentes_evento", ["cliente_id"])


def downgrade() -> None:
    op.drop_index("ix_asistentes_evento_cliente_id", table_name="asistentes_evento")
    op.drop_constraint("fk_asistentes_evento_cliente", "asistentes_evento", type_="foreignkey")
    op.drop_column("asistentes_evento", "cliente_id")
