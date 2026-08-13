from __future__ import annotations

from datetime import date, time

from sqlalchemy import Date, Float, ForeignKey, Integer, String, Text, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Cliente(Base):
    __tablename__ = "clientes"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    nombre: Mapped[str] = mapped_column(String(150), nullable=False)
    telefono: Mapped[str] = mapped_column(String(40), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False, unique=True)
    ciudad: Mapped[str] = mapped_column(String(100), nullable=False)
    direccion: Mapped[str | None] = mapped_column(String(255))
    notas: Mapped[str | None] = mapped_column(Text)

    pedidos: Mapped[list[Pedido]] = relationship(back_populates="cliente", cascade="all, delete-orphan")
    asistencias: Mapped[list[AsistenteEvento]] = relationship(foreign_keys="AsistenteEvento.cliente_id")


class Producto(Base):
    __tablename__ = "productos"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    nombre: Mapped[str] = mapped_column(String(150), nullable=False)
    categoria: Mapped[str] = mapped_column(String(100), nullable=False)
    precio: Mapped[float] = mapped_column(Float, nullable=False)
    stock: Mapped[int] = mapped_column(Integer, nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=False)
    imagen: Mapped[str] = mapped_column(String(500), nullable=False)
    lineas_venta: Mapped[list[LineaVenta]] = relationship(back_populates="producto")


class Evento(Base):
    __tablename__ = "eventos"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    nombre: Mapped[str] = mapped_column(String(150), nullable=False)
    tipo: Mapped[str] = mapped_column(String(20), nullable=False, default="Imagen")
    media: Mapped[str] = mapped_column(String(500), nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=False)
    fecha: Mapped[date] = mapped_column(Date, nullable=False)
    hora: Mapped[time] = mapped_column(Time, nullable=False)
    ubicacion: Mapped[str] = mapped_column(String(200), nullable=False)
    duracion: Mapped[int] = mapped_column(Integer, nullable=False)
    frase: Mapped[str] = mapped_column(String(255), nullable=False)
    queTrae: Mapped[str] = mapped_column(Text, nullable=False)
    cupos: Mapped[int] = mapped_column(Integer, nullable=False)
    cuposDisponibles: Mapped[int] = mapped_column(Integer, nullable=False)
    precio: Mapped[float] = mapped_column(Float, nullable=False)
    estado: Mapped[str] = mapped_column(String(20), nullable=False)


class AsistenteEvento(Base):
    __tablename__ = "asistentes_evento"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    evento_id: Mapped[str] = mapped_column(ForeignKey("eventos.id", ondelete="CASCADE"), nullable=False, index=True)
    cliente_id: Mapped[str | None] = mapped_column(ForeignKey("clientes.id", ondelete="SET NULL"), index=True)
    nombreCompleto: Mapped[str] = mapped_column(String(180), nullable=False)
    telefono: Mapped[str] = mapped_column(String(40), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False)
    pago: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    cliente: Mapped[Cliente | None] = relationship(foreign_keys=[cliente_id])


class Pedido(Base):
    __tablename__ = "pedidos"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    cliente_id: Mapped[str] = mapped_column(ForeignKey("clientes.id"), nullable=False, index=True)
    codigo: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    fecha: Mapped[date] = mapped_column(Date, nullable=False)
    formaPago: Mapped[str] = mapped_column(String(80), nullable=False)
    direccionEnvio: Mapped[str] = mapped_column(String(255), nullable=False)
    total: Mapped[float] = mapped_column(Float, nullable=False)
    notas: Mapped[str | None] = mapped_column(Text)

    cliente: Mapped[Cliente] = relationship(back_populates="pedidos")
    lineas: Mapped[list[LineaVenta]] = relationship(back_populates="pedido", cascade="all, delete-orphan")


class LineaVenta(Base):
    __tablename__ = "lineas_venta"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    pedido_id: Mapped[str] = mapped_column(ForeignKey("pedidos.id", ondelete="CASCADE"), nullable=False, index=True)
    producto_id: Mapped[str] = mapped_column(ForeignKey("productos.id"), nullable=False, index=True)
    precio_unitario: Mapped[float] = mapped_column(Float, nullable=False)
    cantidad: Mapped[int] = mapped_column(Integer, nullable=False)
    subtotal: Mapped[float] = mapped_column(Float, nullable=False)

    pedido: Mapped[Pedido] = relationship(back_populates="lineas")
    producto: Mapped[Producto] = relationship(back_populates="lineas_venta")


class Galeria(Base):
    __tablename__ = "galeria"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    titulo: Mapped[str] = mapped_column(String(150), nullable=False)
    tipo: Mapped[str] = mapped_column(String(20), nullable=False)
    media: Mapped[str] = mapped_column(String(500), nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=False)


class Testimonio(Base):
    __tablename__ = "testimonios"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    nombre: Mapped[str] = mapped_column(String(150), nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=False)
    tipo: Mapped[str] = mapped_column(String(80), nullable=False)
    estado: Mapped[str] = mapped_column(String(20), nullable=False)


class Gasto(Base):
    __tablename__ = "gastos"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    fecha: Mapped[date] = mapped_column(Date, nullable=False)
    concepto: Mapped[str] = mapped_column(String(150), nullable=False)
    categoria: Mapped[str] = mapped_column(String(100), nullable=False)
    proveedor: Mapped[str | None] = mapped_column(String(150))
    monto: Mapped[float] = mapped_column(Float, nullable=False)


class Proveedor(Base):
    __tablename__ = "proveedores"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    nombre_empresa: Mapped[str] = mapped_column(String(150), nullable=False)
    nit: Mapped[str | None] = mapped_column(String(50))
    direccion: Mapped[str] = mapped_column(String(255), nullable=False)
    celular: Mapped[str] = mapped_column(String(40), nullable=False)
    municipio: Mapped[str] = mapped_column(String(100), nullable=False)


class CostoProduccion(Base):
    __tablename__ = "costos_produccion"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    producto_id: Mapped[str] = mapped_column(ForeignKey("productos.id"), nullable=False, index=True)
    fecha: Mapped[date] = mapped_column(Date, nullable=False)
    cantidad_producida: Mapped[int] = mapped_column(Integer, nullable=False)

    producto: Mapped[Producto] = relationship()
    materiales: Mapped[list[MaterialCosto]] = relationship(back_populates="costo_produccion", cascade="all, delete-orphan")


class MaterialCosto(Base):
    __tablename__ = "materiales_costo"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    costo_produccion_id: Mapped[str] = mapped_column(ForeignKey("costos_produccion.id", ondelete="CASCADE"), nullable=False, index=True)
    proveedor_id: Mapped[str] = mapped_column(ForeignKey("proveedores.id"), nullable=False, index=True)
    descripcion: Mapped[str] = mapped_column(String(150), nullable=False)
    cantidad: Mapped[str] = mapped_column(String(80), nullable=False)
    valor: Mapped[float] = mapped_column(Float, nullable=False)

    costo_produccion: Mapped[CostoProduccion] = relationship(back_populates="materiales")
    proveedor: Mapped[Proveedor] = relationship()


class Costo(Base):
    __tablename__ = "costos"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    insumo: Mapped[str] = mapped_column(String(150), nullable=False)
    productoRelacionado: Mapped[str] = mapped_column(String(150), nullable=False)
    cantidad: Mapped[str] = mapped_column(String(80), nullable=False)
    costoUnitario: Mapped[float] = mapped_column(Float, nullable=False)
    costoTotal: Mapped[float] = mapped_column(Float, nullable=False)
