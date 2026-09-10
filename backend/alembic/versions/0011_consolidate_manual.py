"""consolidate manual changes: usuarios, categorias, suscriptores, cuidados
tables + column patches on pedidos, gastos, costos_produccion

Revision ID: 0011_consolidate_manual
Revises: 0010_pagos_venta
Create Date: 2026-09-09
"""

from alembic import op
import sqlalchemy as sa

revision = "0011_consolidate_manual"
down_revision = "0010_pagos_venta"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # --- Tablas creadas manualmente, ahora versionadas ---
    op.create_table(
        "usuarios",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("email", sa.String(length=150), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("nombre", sa.String(length=150), nullable=False),
        sa.Column("activo", sa.Boolean(), nullable=False, server_default=sa.true()),
    )

    op.create_table(
        "categorias",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("nombre", sa.String(length=100), nullable=False, unique=True),
    )

    op.create_table(
        "suscriptores",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("correo", sa.String(length=255), nullable=False, unique=True),
        sa.Column("fecha", sa.Date(), nullable=False),
    )

    op.create_table(
        "cuidados",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("pregunta", sa.String(length=300), nullable=False),
        sa.Column("respuesta", sa.Text(), nullable=False),
        sa.Column("orden", sa.Integer(), nullable=False, server_default="0"),
    )

    # --- pedidos.estado: se había quitado en 0007, se volvió a agregar a mano ---
    op.add_column(
        "pedidos",
        sa.Column("estado", sa.String(length=50), nullable=False, server_default="Pendiente"),
    )

    # --- gastos.tipo ---
    op.add_column(
        "gastos",
        sa.Column("tipo", sa.String(length=20), nullable=False, server_default="General"),
    )

    # --- costos_produccion: tipo, producto_id nullable, sin FK ---
    op.add_column(
        "costos_produccion",
        sa.Column("tipo", sa.String(length=20), nullable=False, server_default="producto"),
    )
    op.drop_constraint(
        "costos_produccion_producto_id_fkey", "costos_produccion", type_="foreignkey"
    )
    op.alter_column("costos_produccion", "producto_id", nullable=True)


def downgrade() -> None:
    op.alter_column("costos_produccion", "producto_id", nullable=False)
    op.create_foreign_key(
        "costos_produccion_producto_id_fkey",
        "costos_produccion", "productos", ["producto_id"], ["id"],
    )
    op.drop_column("costos_produccion", "tipo")

    op.drop_column("gastos", "tipo")

    op.drop_column("pedidos", "estado")

    op.drop_table("cuidados")
    op.drop_table("suscriptores")
    op.drop_table("categorias")
    op.drop_table("usuarios")