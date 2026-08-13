import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { useCrudState } from './hooks/useCrudState';
import {
  SEED_CLIENTES,
  SEED_PRODUCTOS,
  SEED_EVENTOS,
  SEED_PEDIDOS,
  SEED_GASTOS,
  SEED_COSTOS,
  SEED_GALERIA,
  SEED_TESTIMONIOS,
} from './data/seed';
import type { Cliente, ProductoAdmin, EventoAdmin, Pedido, Gasto, Costo, GaleriaAdmin, TestimonioAdmin } from './types';

export interface AdminContextType {
  clientes: ReturnType<typeof useCrudState<Cliente>>;
  productos: ReturnType<typeof useCrudState<ProductoAdmin>>;
  eventos: ReturnType<typeof useCrudState<EventoAdmin>>;
  pedidos: ReturnType<typeof useCrudState<Pedido>>;
  gastos: ReturnType<typeof useCrudState<Gasto>>;
  costos: ReturnType<typeof useCrudState<Costo>>;
  galeria: ReturnType<typeof useCrudState<GaleriaAdmin>>;
  testimonios: ReturnType<typeof useCrudState<TestimonioAdmin>>;
}

export function AdminLayout() {
  const clientes = useCrudState<Cliente>(SEED_CLIENTES);
  const productos = useCrudState<ProductoAdmin>(SEED_PRODUCTOS);
  const eventos = useCrudState<EventoAdmin>(SEED_EVENTOS);
  const pedidos = useCrudState<Pedido>(SEED_PEDIDOS);
  const gastos = useCrudState<Gasto>(SEED_GASTOS);
  const costos = useCrudState<Costo>(SEED_COSTOS);
  const galeria = useCrudState<GaleriaAdmin>(SEED_GALERIA);
  const testimonios = useCrudState<TestimonioAdmin>(SEED_TESTIMONIOS);

  const ctx: AdminContextType = { clientes, productos, eventos, pedidos, gastos, costos, galeria, testimonios };

  return (
    <div className="flex min-h-screen bg-[#FBF8F3]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden px-6 py-8 md:px-10 md:py-10">
        <Outlet context={ctx} />
      </main>
    </div>
  );
}

export default AdminLayout;
