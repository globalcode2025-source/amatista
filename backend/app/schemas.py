from __future__ import annotations

from datetime import date, time

from pydantic import BaseModel, ConfigDict


class CategoriaBase(BaseModel):
    nombre: str


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaRead(CategoriaBase):
    id: str

    model_config = ConfigDict(from_attributes=True)


class SuscriptorBase(BaseModel):
    correo: str


class SuscriptorCreate(SuscriptorBase):
    pass


class SuscriptorRead(SuscriptorBase):
    id: str
    fecha: date

    model_config = ConfigDict(from_attributes=True)


class GaleriaBase(BaseModel):
    titulo: str
    tipo: str
    media: str
    descripcion: str


class GaleriaCreate(GaleriaBase):
    pass


class GaleriaUpdate(BaseModel):
    titulo: str | None = None
    tipo: str | None = None
    media: str | None = None
    descripcion: str | None = None


class GaleriaRead(GaleriaBase):
    id: str

    model_config = ConfigDict(from_attributes=True)


class EventoBase(BaseModel):
    nombre: str
    tipo: str
    media: str
    descripcion: str
    fecha: date
    hora: time
    ubicacion: str
    duracion: int
    frase: str
    queTrae: str
    cupos: int
    cuposDisponibles: int
    precio: float
    estado: str


class EventoRead(EventoBase):
    id: str

    model_config = ConfigDict(from_attributes=True)


class AsistenteEventoCreate(BaseModel):
    clienteId: str
    pago: float = 0


class AsistenteEventoRead(AsistenteEventoCreate):
    id: str
    clienteId: str | None = None
    nombreCompleto: str
    telefono: str
    email: str
    debe: float
    estado: str

    model_config = ConfigDict(from_attributes=True)


class PagoAsistenteCreate(BaseModel):
    pago: float


class ClienteBase(BaseModel):
    nombre: str
    telefono: str
    email: str
    ciudad: str
    direccion: str | None = None
    notas: str | None = None


class ClienteCreate(ClienteBase):
    pass


class ClienteUpdate(BaseModel):
    nombre: str | None = None
    telefono: str | None = None
    email: str | None = None
    ciudad: str | None = None
    direccion: str | None = None
    notas: str | None = None


class ClienteRead(ClienteBase):
    id: str

    model_config = ConfigDict(from_attributes=True)


class ProductoBase(BaseModel):
    nombre: str
    categoria: str
    precio: float
    stock: int
    descripcion: str
    imagen: str


class ProductoRead(ProductoBase):
    id: str
    model_config = ConfigDict(from_attributes=True)


class PedidoBase(BaseModel):
    clienteId: str
    codigo: str
    fecha: date
    formaPago: str
    direccionEnvio: str
    total: float
    notas: str | None = None
    estado: str = "Pendiente"  # Pendiente, Proceso, Despachado, Entregado


class LineaVentaInput(BaseModel):
    productoId: str
    cantidad: int


class LineaVentaRead(LineaVentaInput):
    nombre: str
    precioUnitario: float
    subtotal: float


class PedidoCreate(BaseModel):
    clienteId: str
    formaPago: str
    notas: str | None = None
    productos: list[LineaVentaInput]
    pagoInicial: float = 0


class PedidoUpdate(BaseModel):
    clienteId: str | None = None
    formaPago: str | None = None
    notas: str | None = None
    productos: list[LineaVentaInput] | None = None


class PedidoRead(PedidoBase):
    id: str
    totalPagado: float
    debe: float
    estado: str  # Estado del pedido (logística)
    estadoVenta: str  # Estado de la venta (financiero)
    productos: list[LineaVentaRead] = []
    clienteNombre: str | None = None
    clienteTelefono: str | None = None
    clienteCiudad: str | None = None
    model_config = ConfigDict(from_attributes=True)


class PagoVentaCreate(BaseModel):
    monto: float


class PagoVentaRead(BaseModel):
    id: str
    codigo: str
    fecha: date
    monto: float

    model_config = ConfigDict(from_attributes=True)


class TestimonioBase(BaseModel):
    nombre: str
    descripcion: str
    tipo: str
    estado: str


class TestimonioCreate(BaseModel):
    nombre: str
    descripcion: str
    tipo: str


class TestimonioEstadoUpdate(BaseModel):
    estado: str


class TestimonioRead(TestimonioBase):
    id: str

    model_config = ConfigDict(from_attributes=True)


class GastoBase(BaseModel):
    fecha: date
    concepto: str
    categoria: str
    tipo: str = 'General'
    monto: float


class GastoCreate(GastoBase):
    pass


class GastoUpdate(BaseModel):
    fecha: date | None = None
    concepto: str | None = None
    categoria: str | None = None
    tipo: str | None = None
    monto: float | None = None


class GastoRead(GastoBase):
    id: str

    model_config = ConfigDict(from_attributes=True)


class ProveedorBase(BaseModel):
    nombreEmpresa: str
    nit: str | None = None
    direccion: str
    celular: str
    municipio: str


class ProveedorCreate(ProveedorBase):
    pass


class ProveedorUpdate(BaseModel):
    nombreEmpresa: str | None = None
    nit: str | None = None
    direccion: str | None = None
    celular: str | None = None
    municipio: str | None = None


class ProveedorRead(ProveedorBase):
    id: str

    model_config = ConfigDict(from_attributes=True)


class MaterialCostoInput(BaseModel):
    proveedorId: str
    descripcion: str
    cantidad: str
    valor: float


class MaterialCostoRead(MaterialCostoInput):
    id: str
    proveedorNombre: str


class CostoProduccionCreate(BaseModel):
    productoId: str
    tipo: str = 'producto'  # 'producto' o 'taller'
    cantidadProducida: int
    materiales: list[MaterialCostoInput]


class CostoProduccionRead(BaseModel):
    id: str
    fecha: date
    productoId: str
    productoNombre: str
    precioProducto: float
    cantidadProducida: int
    costoTotal: float
    costoUnitario: float
    margenUnitario: float
    margenPorcentaje: float
    tipo: str
    materiales: list[MaterialCostoRead]


class CuidadoBase(BaseModel):
    pregunta: str
    respuesta: str
    orden: int = 0


class CuidadoCreate(CuidadoBase):
    pass


class CuidadoUpdate(BaseModel):
    pregunta: str | None = None
    respuesta: str | None = None
    orden: int | None = None


class CuidadoRead(CuidadoBase):
    id: str

    model_config = ConfigDict(from_attributes=True)
