import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { DataTable, type ColumnConfig } from '../components/DataTable';
import { FormField, type FieldConfig } from '../components/FormField';
import { Modal } from '../components/Modal';
import type { Proveedor } from '../types';
import { createProveedor, deleteProveedor, fetchProveedores, updateProveedor } from '../../services/proveedores';

const EMPTY_FORM: Omit<Proveedor, 'id'> = { nombreEmpresa: '', nit: '', direccion: '', celular: '', municipio: '' };

export default function ProveedoresPage() {
  const [items, setItems] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Proveedor | null>(null);
  const [form, setForm] = useState<Omit<Proveedor, 'id'>>(EMPTY_FORM);
  const fields: FieldConfig[] = [{ key: 'nombreEmpresa', label: 'Nombre de la empresa', type: 'text', required: true }, { key: 'nit', label: 'NIT (opcional)', type: 'text' }, { key: 'direccion', label: 'Dirección', type: 'text', required: true }, { key: 'celular', label: 'Número celular', type: 'tel', required: true }, { key: 'municipio', label: 'Municipio', type: 'text', required: true }];
  const columns: ColumnConfig<Proveedor>[] = [{ key: 'nombreEmpresa', label: 'Empresa' }, { key: 'nit', label: 'NIT' }, { key: 'celular', label: 'Celular' }, { key: 'municipio', label: 'Municipio' }, { key: 'direccion', label: 'Dirección' }];
  const load = async () => { try { setLoading(true); setError(''); setItems(await fetchProveedores()); } catch (err) { setError(err instanceof Error ? err.message : 'No se pudieron cargar los proveedores.'); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  const filtered = useMemo(() => { const term = query.trim().toLowerCase(); return term ? items.filter((item) => [item.nombreEmpresa, item.nit ?? '', item.celular, item.municipio, item.direccion].some((value) => value.toLowerCase().includes(term))) : items; }, [items, query]);
  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (item: Proveedor) => { setEditing(item); setForm({ nombreEmpresa: item.nombreEmpresa, nit: item.nit ?? '', direccion: item.direccion, celular: item.celular, municipio: item.municipio }); setModalOpen(true); };
  const submit = async (event: FormEvent) => { event.preventDefault(); try { const wasEditing = Boolean(editing); if (editing) await updateProveedor(editing.id, form); else await createProveedor(form); setModalOpen(false); await load(); setSuccess(`Proveedor ${wasEditing ? 'actualizado' : 'guardado'} correctamente.`); } catch (err) { window.alert(err instanceof Error ? err.message : 'No se pudo guardar el proveedor.'); } };
  const remove = async (item: Proveedor) => { try { await deleteProveedor(item.id); await load(); } catch (err) { window.alert(err instanceof Error ? err.message : 'No se pudo eliminar el proveedor.'); } };

  return <div><div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 className="font-serif text-2xl font-semibold text-ink">Proveedores</h1><p className="text-sm text-ink/55">{items.length} en total</p></div><div className="flex gap-3"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar proveedores..." className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold focus:outline-none" /><button type="button" onClick={openNew} className="rounded-sm bg-amatista-deep px-5 py-2.5 text-sm text-cream hover:bg-amatista-mid">+ Nuevo proveedor</button></div></div>{loading && <p className="rounded-sm border border-ink/10 bg-white px-4 py-3 text-sm text-ink/55">Cargando proveedores...</p>}{!loading && error && <p className="rounded-sm border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">{error}</p>}{success && <p role="status" className="mb-4 rounded-sm border border-success/25 bg-success/10 px-4 py-3 text-sm text-success">{success}</p>}{!loading && !error && <DataTable columns={columns} rows={filtered} onEdit={openEdit} onDelete={remove} whatsappUrl={(item) => { const phone = item.celular.replace(/\D/g, ''); return phone.length >= 10 ? `https://wa.me/${phone.length === 10 && phone.startsWith('3') ? `57${phone}` : phone}` : null; }} emptyLabel="Aún no hay proveedores registrados." />}<Modal open={modalOpen} title={editing ? 'Actualizar proveedor' : 'Agregar proveedor'} onClose={() => setModalOpen(false)}><form onSubmit={submit} className="flex flex-col gap-4">{fields.map((field) => <FormField key={field.key} field={field} value={form[field.key as keyof typeof form]} onChange={(key, value) => setForm((old) => ({ ...old, [key]: value }))} />)}<div className="mt-2 flex justify-center gap-3"><button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-ink/60">Cancelar</button><button type="submit" className="rounded-sm bg-gold px-6 py-2.5 text-sm text-ink">Guardar</button></div></form></Modal></div>;
}
