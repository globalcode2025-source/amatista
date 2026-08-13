"""initial schema for bd_amatista

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-08-06 00:00:00.000000
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "clientes",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("nombre", sa.String(length=150), nullable=False),
        sa.Column("telefono", sa.String(length=40), nullable=False),
        sa.Column("email", sa.String(length=150), nullable=False, unique=True),
        sa.Column("ciudad", sa.String(length=100), nullable=False),
        sa.Column("direccion", sa.String(length=255), nullable=True),
        sa.Column("notas", sa.Text(), nullable=True),
    )

    op.create_table(
        "productos",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("nombre", sa.String(length=150), nullable=False),
        sa.Column("categoria", sa.String(length=100), nullable=False),
        sa.Column("precio", sa.Float(), nullable=False),
        sa.Column("stock", sa.Integer(), nullable=False),
        sa.Column("descripcion", sa.Text(), nullable=False),
        sa.Column("imagen", sa.String(length=500), nullable=False),
    )

    op.create_table(
        "eventos",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("nombre", sa.String(length=150), nullable=False),
        sa.Column("media", sa.String(length=500), nullable=False),
        sa.Column("descripcion", sa.Text(), nullable=False),
        sa.Column("fecha", sa.Date(), nullable=False),
        sa.Column("hora", sa.Time(), nullable=False),
        sa.Column("ubicacion", sa.String(length=200), nullable=False),
        sa.Column("duracion", sa.Integer(), nullable=False),
        sa.Column("frase", sa.String(length=255), nullable=False),
        sa.Column("queTrae", sa.Text(), nullable=False),
        sa.Column("cupos", sa.Integer(), nullable=False),
        sa.Column("cuposDisponibles", sa.Integer(), nullable=False),
        sa.Column("precio", sa.Float(), nullable=False),
        sa.Column("estado", sa.String(length=20), nullable=False),
    )

    op.create_table(
        "pedidos",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("cliente_id", sa.String(length=40), sa.ForeignKey("clientes.id"), nullable=False),
        sa.Column("codigo", sa.String(length=50), nullable=False, unique=True),
        sa.Column("cantidad", sa.Integer(), nullable=False),
        sa.Column("descripcion", sa.Text(), nullable=False),
        sa.Column("fecha", sa.Date(), nullable=False),
        sa.Column("formaPago", sa.String(length=80), nullable=False),
        sa.Column("direccionEnvio", sa.String(length=255), nullable=False),
        sa.Column("estado", sa.String(length=20), nullable=False),
        sa.Column("total", sa.Float(), nullable=False),
        sa.Column("notas", sa.Text(), nullable=True),
    )
    op.create_index("ix_pedidos_cliente_id", "pedidos", ["cliente_id"])

    op.create_table(
        "galeria",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("titulo", sa.String(length=150), nullable=False),
        sa.Column("tipo", sa.String(length=20), nullable=False),
        sa.Column("media", sa.String(length=500), nullable=False),
        sa.Column("descripcion", sa.Text(), nullable=False),
    )

    op.create_table(
        "testimonios",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("nombre", sa.String(length=150), nullable=False),
        sa.Column("descripcion", sa.Text(), nullable=False),
        sa.Column("tipo", sa.String(length=80), nullable=False),
        sa.Column("estado", sa.String(length=20), nullable=False),
    )

    op.create_table(
        "ingresos",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("fecha", sa.Date(), nullable=False),
        sa.Column("concepto", sa.String(length=150), nullable=False),
        sa.Column("categoria", sa.String(length=100), nullable=False),
        sa.Column("monto", sa.Float(), nullable=False),
        sa.Column("metodoPago", sa.String(length=80), nullable=False),
    )

    op.create_table(
        "gastos",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("fecha", sa.Date(), nullable=False),
        sa.Column("concepto", sa.String(length=150), nullable=False),
        sa.Column("categoria", sa.String(length=100), nullable=False),
        sa.Column("proveedor", sa.String(length=150), nullable=True),
        sa.Column("monto", sa.Float(), nullable=False),
    )

    op.create_table(
        "costos",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("insumo", sa.String(length=150), nullable=False),
        sa.Column("productoRelacionado", sa.String(length=150), nullable=False),
        sa.Column("cantidad", sa.String(length=80), nullable=False),
        sa.Column("costoUnitario", sa.Float(), nullable=False),
        sa.Column("costoTotal", sa.Float(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("costos")
    op.drop_table("gastos")
    op.drop_table("ingresos")
    op.drop_table("testimonios")
    op.drop_table("galeria")
    op.drop_table("pedidos")
    op.drop_table("eventos")
    op.drop_table("productos")
    op.drop_table("clientes")