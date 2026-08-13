import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { DataTable, type ColumnConfig } from '../components/DataTable';
import { FormField, type FieldConfig } from '../components/FormField';
import { Modal } from '../components/Modal';
import type { Gasto } from '../types';
import { createGasto, deleteGasto, fetchGastos, updateGasto } from '../../services/gastos';

const EMPTY_FORM: Omit<Gasto, 'id'> = { fecha: '', concepto: '', categoria: 'Otro', monto: 0 };
const CATEGORIAS = ['Transporte', 'Comida', 'Papelería', 'Servicio', 'Operativo', 'Otro'] as const;
const money = (value: number) => `$${value.toLocaleString('es-CO')}`;

export default function GastosPage() {
  const [items, setItems] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Gasto | null>(null);
  const [form, setForm] = useState<Omit<Gasto, 'id'>>(EMPTY_FORM);

  const load = async () => {
    try { setLoading(true); setError(''); setItems(await fetchGastos()); }
    catch (err) { setError(err instanceof Error ? err.message : 'No se pudieron cargar los gastos.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term ? items.filter((item) => [item.fecha, item.concepto, item.categoria].some((value) => value.toLowerCase().includes(term))) : items;
  }, [items, query]);

  const columns: ColumnConfig<Gasto>[] = [
    { key: 'fecha', label: 'Fecha' }, { key: 'concepto', label: 'Concepto' }, { key: 'categoria', label: 'Categoría' }, { key: 'monto', label: 'Monto', render: (item) => money(item.monto) },
  ];
  const fields: FieldConfig[] = [
    { key: 'fecha', label: 'Fecha', type: 'date', required: true }, { key: 'concepto', label: 'Concepto', type: 'text', required: true }, { key: 'categoria', label: 'Categoría', type: 'select', required: true, options: CATEGORIAS.map((categoria) => ({ value: categoria, label: categoria })) }, { key: 'monto', label: 'Monto (COP)', type: 'number', required: true },
  ];

  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (item: Gasto) => { setEditing(item); setForm({ fecha: item.fecha, concepto: item.concepto, categoria: item.categoria, monto: item.monto }); setModalOpen(true); };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const wasEditing = Boolean(editing);
      if (editing) await updateGasto(editing.id, form); else await createGasto(form);
      setModalOpen(false); await load(); setSuccess(`Gasto ${wasEditing ? 'actualizado' : 'guardado'} correctamente.`);
    } catch (err) { window.alert(err instanceof Error ? err.message : 'No se pudo guardar el gasto.'); }
  };
  const remove = async (item: Gasto) => {
    try { await deleteGasto(item.id); await load(); }
    catch (err) { window.alert(err instanceof Error ? err.message : 'No se pudo eliminar el gasto.'); }
  };

  return <div>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 className="font-serif text-2xl font-semibold text-ink">Gastos</h1><p className="text-sm text-ink/55">{items.length} en total</p></div><div className="flex gap-3"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar gastos..." className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold focus:outline-none" /><button type="button" onClick={openNew} className="rounded-sm bg-amatista-deep px-5 py-2.5 text-sm text-cream hover:bg-amatista-mid">+ Nuevo gasto</button></div></div>
    {loading && <p className="rounded-sm border border-ink/10 bg-white px-4 py-3 text-sm text-ink/55">Cargando gastos...</p>}
    {!loading && error && <p className="rounded-sm border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">{error}</p>}
    {success && <p role="status" className="mb-4 rounded-sm border border-success/25 bg-success/10 px-4 py-3 text-sm text-success">{success}</p>}
    {!loading && !error && <DataTable columns={columns} rows={filtered} onEdit={openEdit} onDelete={remove} emptyLabel="Aún no hay gastos registrados." />}
    <Modal open={modalOpen} title={editing ? 'Actualizar gasto' : 'Agregar gasto'} onClose={() => setModalOpen(false)}><form onSubmit={submit} className="flex flex-col gap-4">{fields.map((field) => <FormField key={field.key} field={field} value={form[field.key as keyof typeof form]} onChange={(key, value) => setForm((old) => ({ ...old, [key]: value }))} />)}<div className="mt-2 flex justify-center gap-3"><button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-ink/60">Cancelar</button><button type="submit" className="rounded-sm bg-gold px-6 py-2.5 text-sm text-ink">Guardar</button></div></form></Modal>
  </div>;
}
