import { useEffect, useMemo, useState } from 'react';
import type { Cliente, CostoProduccion, EventoAdmin, Gasto, Pedido } from '../types';
import { fetchClientes } from '../../services/clientes';
import { fetchAsistentesEvento, fetchEventos } from '../../services/eventos';
import { fetchGastos } from '../../services/gastos';
import { fetchPedidos } from '../../services/pedidos';
import { fetchCostos } from '../../services/costos';

type SeriesPoint = { label: string; ingresos: number; gastos: number };

const money = (value: number) => `$${Math.round(value).toLocaleString('es-CO')}`;
const percentage = (value: number, total: number) => total ? Math.round((value / total) * 100) : 0;
const monthKey = (date: string) => date.slice(0, 7);
const monthLabel = (key: string) => new Intl.DateTimeFormat('es-CO', { month: 'short' }).format(new Date(`${key}-02T12:00:00`)).replace('.', '');

function TrendChart({ points }: { points: SeriesPoint[] }) {
  const width = 620, height = 220, left = 34, right = 14, top = 16, bottom = 31;
  const maximum = Math.max(1, ...points.flatMap((point) => [point.ingresos, point.gastos]));
  const coordinates = (key: 'ingresos' | 'gastos') => points.map((point, index) => {
    const x = left + (index * (width - left - right)) / Math.max(1, points.length - 1);
    const y = top + (height - top - bottom) * (1 - point[key] / maximum);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full overflow-visible" role="img" aria-label="Gráfica de ingresos y gastos">
    {[0, .25, .5, .75, 1].map((step) => { const y = top + (height - top - bottom) * step; return <line key={step} x1={left} x2={width - right} y1={y} y2={y} stroke="#e9e5e0" strokeWidth="1" />; })}
    <polyline points={coordinates('ingresos')} fill="none" stroke="#5b9b48" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points={coordinates('gastos')} fill="none" stroke="#ff6d72" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    {(['ingresos', 'gastos'] as const).flatMap((key) => points.map((point, index) => { const [x, y] = coordinates(key).split(' ')[index].split(','); return <circle key={`${key}-${point.label}`} cx={x} cy={y} r="3" fill="white" stroke={key === 'ingresos' ? '#5b9b48' : '#ff6d72'} strokeWidth="1.8" />; }))}
    {points.map((point, index) => <text key={point.label} x={left + (index * (width - left - right)) / Math.max(1, points.length - 1)} y={height - 7} textAnchor="middle" fontSize="10" fill="#918a93">{monthLabel(point.label)}</text>)}
  </svg>;
}

function MetricCard({ title, value, color, icon, details, badge }: { title: string; value: string; color: 'green' | 'red' | 'purple' | 'blue'; icon: string; details?: { label: string; value: string; percent: number }[]; badge?: string }) {
  const styles = { green: 'border-[#dbead9] text-[#4d983f] bg-[#f5fbf3]', red: 'border-[#ffd8d9] text-[#ff626a] bg-[#fff6f6]', purple: 'border-[#e8def9] text-[#8660c9] bg-[#faf7ff]', blue: 'border-[#d4e4fc] text-[#4b7fd1] bg-[#f5f9ff]' }[color];
  const fills = { green: 'bg-[#5b9b48]', red: 'bg-[#ff6d72]', purple: 'bg-[#9672d6]', blue: 'bg-[#4b7fd1]' }[color];
  return <section className={`relative overflow-hidden rounded-xl border bg-white p-5 shadow-[0_2px_10px_rgba(45,32,52,.04)] ${styles.split(' ')[0]}`}><div className={`absolute -right-8 -top-14 h-28 w-36 rounded-[45%] opacity-70 ${styles.split(' ')[3]}`} /><div className="relative"><div className="flex items-center gap-2"><span className={`grid h-7 w-7 place-items-center rounded-md border bg-white text-base ${styles.split(' ')[0]} ${styles.split(' ')[1]}`}>{icon}</span><span className={`text-[10px] font-medium uppercase tracking-wide ${styles.split(' ')[1]}`}>{title}</span></div><p className={`mt-3 font-serif text-[25px] font-semibold ${styles.split(' ')[1]}`}>{value}</p>{badge && <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] ${styles.split(' ')[3]} ${styles.split(' ')[1]}`}>{badge}</span>}{details && <div className="mt-5 space-y-3">{details.map((detail) => <div key={detail.label}><div className="mb-1.5 flex items-center justify-between gap-2 text-[10px] text-ink/75"><span className="flex items-center gap-1.5"><i className={`h-1.5 w-1.5 rounded-full ${fills}`} />{detail.label}</span><span className="font-medium">{detail.value} ({detail.percent}%)</span></div><div className="h-1 rounded-full bg-ink/[.045]"><div className={`h-full rounded-full ${fills}`} style={{ width: `${detail.percent}%` }} /></div></div>)}</div>}</div></section>;
}

export default function Dashboard() {
  const [ventas, setVentas] = useState<Pedido[]>([]); 
  const [gastos, setGastos] = useState<Gasto[]>([]); 
  const [costos, setCostos] = useState<CostoProduccion[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]); 
  const [eventos, setEventos] = useState<EventoAdmin[]>([]); 
  const [asistentesTalleres, setAsistentesTalleres] = useState<{ fecha: string; pago: number; debe: number }[]>([]);
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const load = async () => { 
      try { 
        setLoading(true); 
        setError(''); 
        const [loadedVentas, loadedGastos, loadedCostos, loadedClientes, loadedEventos] = await Promise.all([fetchPedidos(), fetchGastos(), fetchCostos(), fetchClientes(), fetchEventos()]); 
        const asistentes = await Promise.all(loadedEventos.map(async (evento) => { 
          const asistentesEvento = await fetchAsistentesEvento(evento.id);
          return { 
            fecha: evento.fecha, 
            pago: asistentesEvento.reduce((sum, asistente) => sum + asistente.pago, 0),
            debe: asistentesEvento.reduce((sum, asistente) => sum + asistente.debe, 0)
          }; 
        })); 
        setVentas(loadedVentas); 
        setGastos(loadedGastos); 
        setCostos(loadedCostos); 
        setClientes(loadedClientes); 
        setEventos(loadedEventos); 
        setAsistentesTalleres(asistentes); 
      } catch (err) { 
        setError(err instanceof Error ? err.message : 'No se pudo cargar el resumen del negocio.'); 
      } finally { 
        setLoading(false); 
      } 
    }; 
    void load(); 
  }, []);

  // Ingresos: usar totalPagado de ventas y pago de asistentes
  const ingresosProductos = ventas.reduce((sum, venta) => sum + venta.totalPagado, 0); 
  const ingresosTalleres = asistentesTalleres.reduce((sum, asistente) => sum + asistente.pago, 0); 
  const totalIngresos = ingresosProductos + ingresosTalleres;

  // Gastos divididos por tipo
  const gastosProducto = gastos.filter(g => g.tipo === 'Producto').reduce((sum, gasto) => sum + gasto.monto, 0);
  const gastosEvento = gastos.filter(g => g.tipo === 'Evento').reduce((sum, gasto) => sum + gasto.monto, 0);
  const gastosGeneral = gastos.filter(g => g.tipo === 'General').reduce((sum, gasto) => sum + gasto.monto, 0);
  const totalGastos = gastosProducto + gastosEvento + gastosGeneral;

  // Costos divididos por tipo
  const costosProducto = costos.filter(c => c.tipo === 'producto').reduce((sum, costo) => sum + costo.costoTotal, 0);
  const costosEvento = costos.filter(c => c.tipo === 'taller').reduce((sum, costo) => sum + costo.costoTotal, 0);
  const totalCostos = costosProducto + costosEvento;

  // Balance: Ingreso - Gasto - Costo
  const balance = totalIngresos - totalGastos - totalCostos;

  // Estadísticas de ventas y deuda
  const totalVentas = ventas.length;
  const deudaProductos = ventas.reduce((sum, venta) => sum + venta.debe, 0);
  const deudaEventos = asistentesTalleres.reduce((sum, asistente) => sum + asistente.debe, 0);
  const totalDeuda = deudaProductos + deudaEventos;

  const series = useMemo(() => { 
    const dated = [
      ...ventas.map((item) => ({ fecha: item.fecha, ingresos: item.totalPagado, gastos: 0 })), 
      ...asistentesTalleres.map((item) => ({ fecha: item.fecha, ingresos: item.pago, gastos: 0 })), 
      ...gastos.map((item) => ({ fecha: item.fecha, ingresos: 0, gastos: item.monto })), 
      ...costos.map((item) => ({ fecha: item.fecha, ingresos: 0, gastos: item.costoTotal }))
    ]; 
    const keys = [...new Set(dated.map((item) => monthKey(item.fecha)).filter(Boolean))].sort().slice(-6); 
    return keys.map((key) => dated.filter((item) => monthKey(item.fecha) === key).reduce((result, item) => ({ ...result, ingresos: result.ingresos + item.ingresos, gastos: result.gastos + item.gastos }), { label: key, ingresos: 0, gastos: 0 })); 
  }, [ventas, asistentesTalleres, gastos, costos]);

  const recientes = useMemo(() => [...ventas].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.codigo.localeCompare(a.codigo)).slice(0, 5), [ventas]); 
  const clientesPorId = useMemo(() => new Map(clientes.map((cliente) => [cliente.id, cliente.nombre])), [clientes]);
  const proximoTaller = useMemo(() => [...eventos].filter((evento) => evento.estado === 'Próximo').sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora)), [eventos]);

  const gastosPct = { producto: percentage(gastosProducto, totalGastos), evento: percentage(gastosEvento, totalGastos), general: percentage(gastosGeneral, totalGastos) };
  const costosPct = { producto: percentage(costosProducto, totalCostos), evento: percentage(costosEvento, totalCostos) };

  return <div className="max-w-[1380px]">
    <h1 className="mb-1 font-serif text-2xl font-semibold text-ink">Dashboard</h1>
    <p className="mb-7 text-sm text-ink/55">Resumen general del negocio</p>
    
    {loading && <p className="mb-6 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink/55">Cargando información...</p>}
    {error && <p className="mb-6 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">{error}</p>}
    
    {!loading && !error && <>
      <div className="grid gap-4 xl:grid-cols-4">
        <MetricCard 
          title="Ingresos totales" 
          value={money(totalIngresos)} 
          color="green" 
          icon="▣" 
          badge="Pagos recibidos"
          details={[
            { label: 'Productos', value: money(ingresosProductos), percent: percentage(ingresosProductos, totalIngresos) }, 
            { label: 'Talleres', value: money(ingresosTalleres), percent: percentage(ingresosTalleres, totalIngresos) }
          ]} 
        />
        <MetricCard 
          title="Gastos totales" 
          value={money(totalGastos)} 
          color="red" 
          icon="▤" 
          badge="Gastos operativos"
          details={[
            { label: 'Producto', value: money(gastosProducto), percent: gastosPct.producto }, 
            { label: 'Evento', value: money(gastosEvento), percent: gastosPct.evento },
            { label: 'General', value: money(gastosGeneral), percent: gastosPct.general }
          ]} 
        />
        <MetricCard 
          title="Costos totales" 
          value={money(totalCostos)} 
          color="purple" 
          icon="⌁" 
          badge="Costos de producción"
          details={[
            { label: 'Producto', value: money(costosProducto), percent: costosPct.producto }, 
            { label: 'Evento', value: money(costosEvento), percent: costosPct.evento }
          ]} 
        />
        <MetricCard 
          title="Balance del período" 
          value={money(balance)} 
          color={balance >= 0 ? 'green' : 'red'} 
          icon="⌁" 
          badge={balance >= 0 ? '● Resultado positivo' : '● Resultado negativo'} 
          details={[
            { label: 'Ingresos', value: money(totalIngresos), percent: 100 }, 
            { label: 'Egresos', value: money(totalGastos + totalCostos), percent: totalIngresos ? Math.min(100, percentage(totalGastos + totalCostos, totalIngresos)) : 0 }
          ]} 
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <section className="rounded-xl border border-ink/10 bg-white p-5 shadow-[0_2px_10px_rgba(45,32,52,.04)]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif text-base font-semibold">Ingresos vs Egresos</h2>
              <div className="mt-2 flex gap-5 text-[10px] text-ink/60">
                <span className="flex items-center gap-1.5"><i className="h-0.5 w-3 rounded-full bg-[#5b9b48]" />Ingresos</span>
                <span className="flex items-center gap-1.5"><i className="h-0.5 w-3 rounded-full bg-[#ff6d72]" />Egresos</span>
              </div>
            </div>
          </div>
          <div className="mt-4"><TrendChart points={series} /></div>
        </section>

        <section className="rounded-xl border border-ink/10 bg-white p-5 shadow-[0_2px_10px_rgba(45,32,52,.04)]">
          <h2 className="font-serif text-base font-semibold">Estadísticas de ventas</h2>
          <div className="mt-4 grid gap-4">
            <div className="flex items-center justify-between rounded-lg bg-cream p-3">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-ink/55">Total ventas</p>
                <p className="font-serif text-lg font-semibold text-ink">{totalVentas}</p>
              </div>
              <span className="text-2xl">📦</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-cream p-3">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-ink/55">Deuda total</p>
                <p className="font-serif text-lg font-semibold text-ink">{money(totalDeuda)}</p>
              </div>
              <span className="text-2xl">💳</span>
            </div>
            <div className="rounded-lg border border-ink/10 p-3">
              <p className="mb-2 text-[10px] uppercase tracking-wide text-ink/55">Deuda por tipo</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Productos</span>
                  <span className="font-medium">{money(deudaProductos)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Eventos</span>
                  <span className="font-medium">{money(deudaEventos)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <section className="rounded-xl border border-ink/10 bg-white p-5 shadow-[0_2px_10px_rgba(45,32,52,.04)]">
          <h2 className="font-serif text-base font-semibold">Ventas recientes</h2>
          <div className="mt-4 space-y-3">
            {recientes.length === 0 && <p className="text-sm text-ink/55">No hay ventas recientes.</p>}
            {recientes.map((venta) => <div key={venta.id} className="flex items-center justify-between rounded-lg border border-ink/10 p-3">
              <div>
                <p className="font-medium text-ink">{venta.codigo}</p>
                <p className="text-xs text-ink/55">{clientesPorId.get(venta.clienteId) || 'Cliente desconocido'}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-ink">{money(venta.totalPagado)}</p>
                <p className="text-xs text-ink/55">{venta.fecha}</p>
              </div>
            </div>)}
          </div>
        </section>

        <section className="rounded-xl border border-ink/10 bg-white p-5 shadow-[0_2px_10px_rgba(45,32,52,.04)]">
          <h2 className="font-serif text-base font-semibold">Próximos talleres</h2>
          {proximoTaller && proximoTaller.length > 0 ? <div className="mt-4 space-y-3">
            {proximoTaller.map((taller) => <div key={taller.id} className="rounded-lg border border-ink/10 p-3">
              <p className="font-serif text-lg font-semibold text-ink">{taller.nombre}</p>
              <div className="mt-2 flex gap-4 text-sm text-ink/60">
                <span>{taller.fecha}</span>
                <span>{taller.hora}</span>
                <span>{taller.ubicacion}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full bg-cream px-2 py-1 text-xs">{taller.cuposDisponibles} cupos disponibles</span>
                <span className="text-xs text-ink/55">Precio: {money(taller.precio)}</span>
              </div>
            </div>)}
          </div> : <p className="mt-4 text-sm text-ink/55">No hay talleres programados.</p>}
        </section>
      </div>
    </>}
  </div>;
}