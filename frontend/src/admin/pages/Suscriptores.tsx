import { useEffect, useMemo, useState } from 'react';
import { DataTable, type ColumnConfig } from '../components/DataTable';
import type { Suscriptor } from '../types';
import { fetchSuscriptores } from '../../services/suscriptores';

export default function SuscriptoresPage() {
  const [items, setItems] = useState<Suscriptor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      setItems(await fetchSuscriptores());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los suscriptores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term
      ? items.filter((item) => [item.correo, item.fecha].some((value) => value.toLowerCase().includes(term)))
      : items;
  }, [items, query]);

  const columns: ColumnConfig<Suscriptor>[] = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'correo', label: 'Correo' },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Suscriptores</h1>
          <p className="text-sm text-ink/55">{items.length} en total</p>
        </div>
        <div className="flex gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar suscriptores..."
            className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {loading && (
        <p className="rounded-sm border border-ink/10 bg-white px-4 py-3 text-sm text-ink/55">
          Cargando suscriptores...
        </p>
      )}
      {!loading && error && (
        <p className="rounded-sm border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}
      {!loading && !error && (
        <DataTable
          columns={columns}
          rows={filtered}
          emptyLabel="Aún no hay suscriptores registrados."
          onEdit={() => {}}
          onDelete={() => {}}
          showActions={false}
        />
      )}
    </div>
  );
}