export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  ciudad: string;
  direccion?: string;
  notas?: string;
}

export interface ProductoAdmin {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
  imagen: string;
}

export type EstadoEvento = 'Próximo' | 'Realizado' | 'Cancelado';

export interface EventoAdmin {
  id: string;
  nombre: string;
  tipo: TipoContenido;
  media: string;
  descripcion: string;
  fecha: string;
  hora: string;
  ubicacion: string;
  duracion: number;
  frase: string;
  queTrae: string;
  cupos: number;
  cuposDisponibles: number;
  precio: number;
  estado: EstadoEvento;
}

export interface LineaVenta {
  productoId: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface Pedido {
  id: string;
  clienteId: string;
  codigo: string;
  fecha: string;
  formaPago: string;
  direccionEnvio: string;
  total: number;
  notas?: string;
  productos: LineaVenta[];
}

export type TipoContenido = 'Imagen' | 'Video';

export interface GaleriaAdmin {
  id: string;
  titulo: string;
  tipo: TipoContenido;
  media: string;
  descripcion: string;
}

export interface TestimonioAdmin {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  estado: EstadoTestimonio;
}

export type EstadoTestimonio = 'Pendiente' | 'Aceptado' | 'Rechazado';

export interface Ingreso {
  id: string;
  fecha: string;
  concepto: string;
  categoria: string;
  monto: number;
  metodoPago: string;
}

export type CategoriaGasto = 'Transporte' | 'Comida' | 'Papelería' | 'Servicio' | 'Operativo' | 'Otro';

export interface Gasto {
  id: string;
  fecha: string;
  concepto: string;
  categoria: CategoriaGasto;
  monto: number;
}

export interface Proveedor {
  id: string;
  nombreEmpresa: string;
  nit?: string;
  direccion: string;
  celular: string;
  municipio: string;
}

export interface MaterialCosto {
  id?: string;
  proveedorId: string;
  proveedorNombre?: string;
  descripcion: string;
  cantidad: string;
  valor: number;
}

export interface CostoProduccion {
  id: string;
  fecha: string;
  productoId: string;
  productoNombre: string;
  precioProducto: number;
  cantidadProducida: number;
  costoTotal: number;
  costoUnitario: number;
  margenUnitario: number;
  margenPorcentaje: number;
  materiales: MaterialCosto[];
}

/** Costos de producción — insumos que componen el costo de cada producto */
export interface Costo {
  id: string;
  insumo: string;
  productoRelacionado: string;
  cantidad: string;
  costoUnitario: number;
  costoTotal: number;
}
