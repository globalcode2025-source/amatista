import { useOutletContext } from 'react-router-dom';
import type { AdminContextType } from '../admin/AdminLayout';
import { StatusBadge } from '../components/StatusBadge';

const money = (n: number) => `$${n.toLocaleString('es-CO')}`;

export default function Dashboard() {
  const { ingresos, gastos, pedidos, clientes, eventos } = useOutletContext<AdminContextType>();

  const totalIngresos = ingresos.items.reduce((sum: number, i: { monto: number }) => sum + i.monto, 0);
  const totalGastos = gastos.items.reduce((sum: number, g: { monto: number }) => sum + g.monto, 0);
  const balance = totalIngresos - totalGastos;
  const pedidosPendientes = pedidos.items.filter((p: { estado: string }) => p.estado === 'Pendiente').length;

  const proximoEvento = [...eventos.items]
    .filter((e: { estado: string }) => e.estado === 'Próximo')
    .sort((a: { fecha: string }, b: { fecha: string }) => a.fecha.localeCompare(b.fecha))[0];

  const recientes = [...pedidos.items].sort((a: { fecha: string }, b: { fecha: string }) => b.fecha.localeCompare(a.fecha)).slice(0, 5);
  const nombreCliente = (id: string) => clientes.items.find((c: { id: string; nombre: string }) => c.id === id)?.nombre ?? 'Cliente eliminado';

  const kpis = [
    { label: 'Ingresos totales', value: money(totalIngresos), accent: 'text-success' },
    { label: 'Gastos totales', value: money(totalGastos), accent: 'text-danger' },
    { label: 'Balance', value: money(balance), accent: balance >= 0 ? 'text-success' : 'text-danger' },
    { label: 'Pedidos pendientes', value: String(pedidosPendientes), accent: 'text-gold' },
  ];

  return (
    <div>
      <h1 className="mb-1 font-serif text-2xl font-semibold text-ink">Dashboard</h1>
      <p className="mb-8 text-sm text-ink/55">Resumen general del negocio</p>

      <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-sm border border-ink/10 bg-white p-6">
            <span className="text-xs uppercase tracking-wide text-ink/50">{k.label}</span>
            <div className={`mt-2 font-serif text-2xl font-semibold ${k.accent}`}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-sm border border-ink/10 bg-white p-6">
          <h3 className="mb-4 font-serif text-lg font-semibold text-ink">Pedidos recientes</h3>
          <div className="flex flex-col divide-y divide-ink/8">
            {recientes.length === 0 && <p className="py-6 text-sm text-ink/50">Aún no hay pedidos.</p>}
            {recientes.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div>
                  <div className="font-medium text-ink">{nombreCliente(p.clienteId)}</div>
                  <div className="text-xs text-ink/50">{p.fecha}</div>
                </div>
                <StatusBadge estado={p.estado} />
                <span className="font-serif font-semibold text-ink">{money(p.total)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-sm border border-ink/10 bg-white p-6">
          <h3 className="mb-4 font-serif text-lg font-semibold text-ink">Próximo taller</h3>
          {proximoEvento ? (
            <div>
              <div className="font-serif text-lg font-semibold text-ink">{proximoEvento.nombre}</div>
              <p className="mt-1 text-sm text-ink/60">
                {proximoEvento.fecha} · {proximoEvento.hora}
              </p>
              <p className="mt-1 text-sm text-ink/60">{proximoEvento.ubicacion}</p>
              <div className="mt-4 rounded-sm bg-cream px-4 py-3 text-sm text-ink/70">
                {proximoEvento.cuposDisponibles} de {proximoEvento.cupos} cupos disponibles
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink/50">No hay talleres próximos programados.</p>
          )}
        </div>
      </div>
    </div>
  );
}