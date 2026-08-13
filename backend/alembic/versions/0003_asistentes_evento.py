"""add event attendees

Revision ID: 0003_asistentes_evento
Revises: 0002_eventos_tipo
Create Date: 2026-08-12
"""

from alembic import op
import sqlalchemy as sa

revision = "0003_asistentes_evento"
down_revision = "0002_eventos_tipo"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "asistentes_evento",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("evento_id", sa.String(length=40), sa.ForeignKey("eventos.id", ondelete="CASCADE"), nullable=False),
        sa.Column("nombreCompleto", sa.String(length=180), nullable=False),
        sa.Column("telefono", sa.String(length=40), nullable=False),
        sa.Column("email", sa.String(length=150), nullable=False),
        sa.Column("pago", sa.Float(), nullable=False, server_default="0"),
    )
    op.create_index("ix_asistentes_evento_evento_id", "asistentes_evento", ["evento_id"])


def downgrade() -> None:
    op.drop_index("ix_asistentes_evento_evento_id", table_name="asistentes_evento")
    op.drop_table("asistentes_evento")
