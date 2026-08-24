import { useEffect, useState } from 'react';
import type { Pedido } from '../types';
import { fetchPedidosGestion, updatePedidoEstado } from '../../services/pedidosGestion';

const ESTADOS_PEDIDO = ['Pendiente', 'Proceso', 'Despachado', 'Entregado'];

const money = (n: number) => `$${n.toLocaleString('es-CO')}`;

export default function Pedido() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroEstadoPedido, setFiltroEstadoPedido] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');

  const loadPedidos = async () => {
    try {
      setLoading(true);
      setError('');
      const estadoParam = filtroEstadoPedido === 'Todas' ? undefined : filtroEstadoPedido;
      const data = await fetchPedidosGestion(estadoParam, busqueda || undefined);
      setPedidos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPedidos();
  }, [filtroEstadoPedido, busqueda]);

  const handleEstadoPedidoChange = async (pedidoId: string, nuevoEstado: string) => {
    try {
      await updatePedidoEstado(pedidoId, nuevoEstado);
      loadPedidos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el estado');
    }
  };

  const getEstadoPedidoColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Proceso': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Despachado': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Entregado': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Gestión de Pedidos</h1>
          <p className="text-sm text-ink/55">{pedidos.length} en total</p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Buscar pedidos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <span className="text-xs text-ink/55 self-center">Estado Pedido:</span>
        {ESTADOS_PEDIDO.map(estado => (
          <button
            key={estado}
            onClick={() => setFiltroEstadoPedido(estado)}
            className={`rounded-sm px-4 py-2 text-sm ${
              filtroEstadoPedido === estado 
                ? 'bg-amatista-deep text-cream' 
                : 'bg-white border border-ink/15 text-ink hover:bg-cream'
            }`}
          >
            {estado}
          </button>
        ))}
        <button
          onClick={() => setFiltroEstadoPedido('Todas')}
          className={`rounded-sm px-4 py-2 text-sm ${
            filtroEstadoPedido === 'Todas' 
              ? 'bg-amatista-deep text-cream' 
              : 'bg-white border border-ink/15 text-ink hover:bg-cream'
          }`}
        >
          Todos
        </button>
      </div>

      {loading && (
        <p className="rounded-sm border border-ink/10 bg-white px-4 py-3 text-sm text-ink/55">
          Cargando pedidos...
        </p>
      )}
      
      {!loading && error && (
        <p className="rounded-sm border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}
      
      {!loading && !error && (
        <div className="overflow-x-auto rounded-sm border border-ink/10 bg-white">
          <table className="w-full min-w-[1000px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-cream/70 text-left">
                <th className="px-5 py-3.5 text-[0.72rem] uppercase tracking-wide text-ink/55">Código</th>
                <th className="px-5 py-3.5 text-[0.72rem] uppercase tracking-wide text-ink/55">Cliente</th>
                <th className="px-5 py-3.5 text-[0.72rem] uppercase tracking-wide text-ink/55">Celular</th>
                <th className="px-5 py-3.5 text-[0.72rem] uppercase tracking-wide text-ink/55">Dirección</th>
                <th className="px-5 py-3.5 text-[0.72rem] uppercase tracking-wide text-ink/55">Productos</th>
                <th className="px-5 py-3.5 text-[0.72rem] uppercase tracking-wide text-ink/55">Total</th>
                <th className="px-5 py-3.5 text-[0.72rem] uppercase tracking-wide text-ink/55">Estado Pedido</th>
                <th className="px-5 py-3.5 text-[0.72rem] uppercase tracking-wide text-ink/55">Cambiar Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-ink/55">
                    No hay pedidos que coincidan con los filtros
                  </td>
                </tr>
              ) : (
                pedidos.map((pedido) => (
                  <tr key={pedido.id} className="border-b border-ink/6 hover:bg-cream/40">
                    <td className="px-5 py-4 text-ink/80 font-medium">{pedido.codigo}</td>
                    <td className="px-5 py-4 text-ink/80">{pedido.clienteNombre || 'Cliente'}</td>
                    <td className="px-5 py-4 text-ink/80">{pedido.clienteTelefono || 'N/A'}</td>
                    <td className="px-5 py-4 text-ink/80">
                      <div className="text-xs">
                        <div>{pedido.clienteCiudad || 'Ciudad'}</div>
                        <div className="text-ink/55">{pedido.direccionEnvio || 'Dirección'}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-ink/80">
                      {pedido.productos?.map((linea, idx) => (
                        <div key={idx} className="text-xs">
                          {linea.nombre} x{linea.cantidad}
                        </div>
                      ))}
                    </td>
                    <td className="px-5 py-4 text-ink/80 font-medium">{money(pedido.total)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium border ${getEstadoPedidoColor(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={pedido.estado}
                        onChange={(e) => handleEstadoPedidoChange(pedido.id, e.target.value)}
                        className="rounded-sm border border-ink/15 px-3 py-1.5 text-xs focus:border-gold focus:outline-none bg-white"
                      >
                        {ESTADOS_PEDIDO.map(estado => (
                          <option key={estado} value={estado}>{estado}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}