import { useEffect, useMemo, useState } from 'react';
import type { EstadoTestimonio, TestimonioAdmin } from '../types';
import { fetchTestimonios, updateEstadoTestimonio } from '../../services/testimonios';

const ESTADOS: EstadoTestimonio[] = ['Pendiente', 'Aceptado', 'Rechazado'];

const estadoClass: Record<EstadoTestimonio, string> = {
  Pendiente: 'bg-gold/15 text-gold',
  Aceptado: 'bg-success/15 text-success',
  Rechazado: 'bg-danger/10 text-danger',
};

export default function TestimoniosPage() {
  const [items, setItems] = useState<TestimonioAdmin[]>([]);
  const [filter, setFilter] = useState<'Todos' | EstadoTestimonio>('Todos');
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [query, setQuery] = useState('');

  const load = async () => {
    try {
      setError('');
      setItems(await fetchTestimonios());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los testimonios.');
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => items.filter((item) => (filter === 'Todos' || item.estado === filter) && [item.nombre, item.descripcion, item.tipo].some((value) => value.toLowerCase().includes(query.toLowerCase()))), [filter, items, query]);

  const moderate = async (item: TestimonioAdmin, estado: 'Aceptado' | 'Rechazado') => {
    try {
      setUpdatingId(item.id);
      const updated = await updateEstadoTestimonio(item.id, estado);
      setItems((current) => current.map((testimonial) => testimonial.id === item.id ? updated : testimonial));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'No se pudo actualizar el estado.');
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {(['Todos', ...ESTADOS] as const).map((state) => <button type="button" key={state} onClick={() => setFilter(state)} className={`rounded-full border px-4 py-2 text-xs ${filter === state ? 'border-amatista-deep bg-amatista-deep text-cream' : 'border-ink/15 text-ink/60'}`}>{state}</button>)}
      </div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="font-serif text-2xl font-semibold text-ink">Testimonios</h1><p className="text-sm text-ink/55">Revisa, acepta o rechaza los testimonios enviados por la comunidad.</p></div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar testimonios..." className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold focus:outline-none" /></div>
      {error && <p className="mb-4 rounded-sm border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">{error}</p>}
      {filtered.length === 0 ? <div className="rounded-sm border border-ink/10 bg-white py-16 text-center text-sm text-ink/50">No hay testimonios en este estado.</div> : <div className="overflow-x-auto rounded-sm border border-ink/10 bg-white">
        <table className="w-full min-w-[820px] border-collapse text-sm"><thead><tr className="border-b border-ink/10 bg-cream/70 text-left"><th className="px-5 py-3.5 text-xs uppercase tracking-wide text-ink/55">Nombre</th><th className="px-5 py-3.5 text-xs uppercase tracking-wide text-ink/55">Testimonio</th><th className="px-5 py-3.5 text-xs uppercase tracking-wide text-ink/55">Tipo</th><th className="px-5 py-3.5 text-xs uppercase tracking-wide text-ink/55">Estado</th><th className="px-5 py-3.5 text-right text-xs uppercase tracking-wide text-ink/55">Moderación</th></tr></thead>
          <tbody>{filtered.map((item) => <tr key={item.id} className="border-b border-ink/6 last:border-0 hover:bg-cream/40"><td className="px-5 py-4 font-medium text-ink">{item.nombre}</td><td className="max-w-[420px] px-5 py-4 leading-relaxed text-ink/80">{item.descripcion}</td><td className="px-5 py-4 text-ink/80">{item.tipo}</td><td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-medium ${estadoClass[item.estado]}`}>{item.estado}</span></td><td className="whitespace-nowrap px-5 py-4 text-right">{item.estado === 'Pendiente' ? <><button type="button" disabled={updatingId === item.id} onClick={() => void moderate(item, 'Aceptado')} className="mr-3 text-xs uppercase tracking-wide text-success disabled:opacity-50">Aceptar</button><button type="button" disabled={updatingId === item.id} onClick={() => void moderate(item, 'Rechazado')} className="text-xs uppercase tracking-wide text-danger disabled:opacity-50">Rechazar</button></> : <span className="text-xs text-ink/45">Moderado</span>}</td></tr>)}</tbody>
        </table>
      </div>}
    </div>
  );
}
