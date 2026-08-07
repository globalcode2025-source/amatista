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

export type EstadoPedido = 'Pendiente' | 'En proceso' | 'Despachado' | 'Entregado';

export interface Pedido {
  id: string;
  clienteId: string;
  codigo: string;
  cantidad: number;
  descripcion: string;
  fecha: string;
  formaPago: string;
  direccionEnvio: string;
  estado: EstadoPedido;
  total: number;
  notas?: string;
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

export interface Gasto {
  id: string;
  fecha: string;
  concepto: string;
  categoria: string;
  proveedor?: string;
  monto: number;
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