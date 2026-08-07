import type {
  Cliente,
  Costo,
  EventoAdmin,
  GaleriaAdmin,
  Gasto,
  Ingreso,
  Pedido,
  ProductoAdmin,
  TestimonioAdmin,
} from '../types';

export const SEED_CLIENTES: Cliente[] = [
  {
    id: 'cli-1',
    nombre: 'Ana Gómez',
    telefono: '300 111 2233',
    email: 'ana@example.com',
    ciudad: 'Bogotá',
    direccion: 'Cra. 10 # 23-45',
    notas: 'Prefiere contacto por WhatsApp.',
  },
  {
    id: 'cli-2',
    nombre: 'Laura Pérez',
    telefono: '300 222 3344',
    email: 'laura@example.com',
    ciudad: 'Medellín',
    direccion: 'Cl. 45 # 12-34',
  },
  {
    id: 'cli-3',
    nombre: 'Marta Ruiz',
    telefono: '300 333 4455',
    email: 'marta@example.com',
    ciudad: 'Cali',
  },
];

export const SEED_PRODUCTOS: ProductoAdmin[] = [
  {
    id: 'prd-1',
    nombre: 'Velas aromáticas x3',
    categoria: 'Hogar',
    precio: 78000,
    stock: 18,
    descripcion: 'Kit de velas con aroma floral y acabado artesanal.',
    imagen: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prd-2',
    nombre: 'Florero cerámico',
    categoria: 'Decoración',
    precio: 92000,
    stock: 9,
    descripcion: 'Florero pintado a mano con esmalte mate.',
    imagen: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prd-3',
    nombre: 'Caja regalo premium',
    categoria: 'Regalos',
    precio: 125000,
    stock: 6,
    descripcion: 'Caja curada con productos seleccionados para obsequio.',
    imagen: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80',
  },
];

export const SEED_EVENTOS: EventoAdmin[] = [
  {
    id: 'evt-1',
    nombre: 'Taller de velas botánicas',
    media: 'https://images.unsplash.com/photo-1518621736915-247d5338a7b5?auto=format&fit=crop&w=900&q=80',
    descripcion: 'Encuentro práctico para crear velas con flores secas y aromas suaves.',
    fecha: '2026-08-18',
    hora: '18:00',
    ubicacion: 'Casa Amatista, Bogotá',
    duracion: 180,
    frase: 'Una experiencia para crear con calma y salir con algo hecho por ti.',
    queTrae: 'Materiales, guía paso a paso, refrigerio y tu vela terminada.',
    cupos: 20,
    cuposDisponibles: 7,
    precio: 150000,
    estado: 'Próximo',
  },
  {
    id: 'evt-2',
    nombre: 'Sesión de decoración de mesa',
    media: 'https://images.unsplash.com/photo-1495232223541-943f8b64e76c?auto=format&fit=crop&w=900&q=80',
    descripcion: 'Clase para montar una mesa estética y funcional para reuniones especiales.',
    fecha: '2026-07-20',
    hora: '10:00',
    ubicacion: 'Medellín',
    duracion: 120,
    frase: 'Detalles pequeños, mesas memorables.',
    queTrae: 'Material decorativo, práctica guiada y asesoría personalizada.',
    cupos: 15,
    cuposDisponibles: 0,
    precio: 130000,
    estado: 'Realizado',
  },
];

export const SEED_PEDIDOS: Pedido[] = [
  {
    id: 'ped-1',
    clienteId: 'cli-1',
    codigo: 'AMT-2026-081',
    cantidad: 12,
    descripcion: 'Pedido corporativo de 12 kits de velas',
    fecha: '2026-08-03',
    formaPago: 'Transferencia',
    direccionEnvio: 'Cra. 10 # 23-45, Bogotá',
    estado: 'Pendiente',
    total: 936000,
    notas: 'Entregar antes de las 4:00 p. m.',
  },
  {
    id: 'ped-2',
    clienteId: 'cli-2',
    codigo: 'AMT-2026-082',
    cantidad: 1,
    descripcion: 'Caja regalo para aniversario',
    fecha: '2026-08-01',
    formaPago: 'Nequi',
    direccionEnvio: 'Cl. 45 # 12-34, Medellín',
    estado: 'En proceso',
    total: 125000,
  },
  {
    id: 'ped-3',
    clienteId: 'cli-3',
    codigo: 'AMT-2026-083',
    cantidad: 2,
    descripcion: 'Florero cerámico y tarjeta personalizada',
    fecha: '2026-07-28',
    formaPago: 'Efectivo',
    direccionEnvio: 'Calle 5 # 8-20, Cali',
    estado: 'Despachado',
    total: 114000,
  },
];

export const SEED_INGRESOS: Ingreso[] = [
  {
    id: 'ing-1',
    fecha: '2026-08-01',
    concepto: 'Venta online',
    categoria: 'E-commerce',
    monto: 125000,
    metodoPago: 'Transferencia',
  },
  {
    id: 'ing-2',
    fecha: '2026-08-03',
    concepto: 'Pedido corporativo',
    categoria: 'Mayorista',
    monto: 936000,
    metodoPago: 'Transferencia',
  },
];

export const SEED_GASTOS: Gasto[] = [
  {
    id: 'gas-1',
    fecha: '2026-08-02',
    concepto: 'Compra de insumos',
    categoria: 'Producción',
    proveedor: 'Insumos del Valle',
    monto: 245000,
  },
  {
    id: 'gas-2',
    fecha: '2026-08-04',
    concepto: 'Envíos y embalaje',
    categoria: 'Logística',
    proveedor: 'ServiExpress',
    monto: 68000,
  },
];

export const SEED_COSTOS: Costo[] = [
  {
    id: 'cos-1',
    insumo: 'Cera de soya',
    productoRelacionado: 'Velas aromáticas x3',
    cantidad: '3 kg',
    costoUnitario: 18000,
    costoTotal: 54000,
  },
  {
    id: 'cos-2',
    insumo: 'Arcilla y esmalte',
    productoRelacionado: 'Florero cerámico',
    cantidad: '1 unidad',
    costoUnitario: 28000,
    costoTotal: 28000,
  },
];

export const SEED_GALERIA: GaleriaAdmin[] = [
  {
    id: 'gal-1',
    titulo: 'Taller de velas botánicas',
    tipo: 'Imagen',
    media: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80',
    descripcion: 'Momento creativo en mesa de trabajo con flores secas.',
  },
  {
    id: 'gal-2',
    titulo: 'Proceso de empaque',
    tipo: 'Video',
    media: 'https://videos.pexels.com/video-files/854753/854753-hd_1920_1080_24fps.mp4',
    descripcion: 'Detalle del empaque final para pedidos especiales.',
  },
];

export const SEED_TESTIMONIOS: TestimonioAdmin[] = [
  {
    id: 'tes-1',
    nombre: 'María Camila R.',
    descripcion: 'El taller me ayudó a vivir la experiencia con mucha calma y atención.',
    tipo: 'Taller',
    estado: 'Aceptado',
  },
  {
    id: 'tes-2',
    nombre: 'Daniela L.',
    descripcion: 'El detalle del empaque y la calidad del producto se notan desde el primer momento.',
    tipo: 'Producto',
    estado: 'Pendiente',
  },
];