import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { DataTable, type ColumnConfig } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { FormField, type FieldConfig } from '../components/FormField';
import type { Cliente, Pedido } from '../types';
import { createCliente, deleteCliente, fetchClientes, updateCliente } from '../../services/clientes';
import { fetchPedidos } from '../../services/pedidos';

type ClienteForm = Omit<Cliente, 'id'>;
const EMPTY_FORM: ClienteForm = { nombre: '', telefono: '', email: '', ciudad: '', direccion: '', notas: '' };
const money = (value: number) => `$${value.toLocaleString('es-CO')}`;

export default function ClientesPage() {
  const [items, setItems] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [form, setForm] = useState<ClienteForm>(EMPTY_FORM);
  const [salesClient, setSalesClient] = useState<Cliente | null>(null);
  const [sales, setSales] = useState<Pedido[]>([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const fields: FieldConfig[] = [{ key: 'nombre', label: 'Nombre completo', type: 'text', required: true }, { key: 'telefono', label: 'Teléfono', type: 'tel', required: true }, { key: 'email', label: 'Correo electrónico', type: 'email', required: true }, { key: 'ciudad', label: 'Ciudad', type: 'text', required: true }, { key: 'direccion', label: 'Dirección', type: 'text' }, { key: 'notas', label: 'Notas', type: 'textarea' }];
  const columns: ColumnConfig<Cliente>[] = [{ key: 'nombre', label: 'Nombre' }, { key: 'telefono', label: 'Teléfono' }, { key: 'email', label: 'Correo' }, { key: 'ciudad', label: 'Ciudad' }, { key: 'direccion', label: 'Dirección' }];
  const load = async () => { try { setLoading(true); setError(''); setItems(await fetchClientes()); } catch (err) { setError(err instanceof Error ? err.message : 'No se pudieron cargar los clientes'); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  const filtered = useMemo(() => { const term = query.trim().toLowerCase(); return term ? items.filter((item) => [item.nombre, item.telefono, item.email, item.ciudad].some((value) => value.toLowerCase().includes(term))) : items; }, [items, query]);
  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (item: Cliente) => { setEditing(item); setForm({ nombre: item.nombre, telefono: item.telefono, email: item.email, ciudad: item.ciudad, direccion: item.direccion ?? '', notas: item.notas ?? '' }); setModalOpen(true); };
  const submit = async (event: FormEvent) => { event.preventDefault(); try { const wasEditing = Boolean(editing); if (editing) await updateCliente(editing.id, form); else await createCliente(form); setModalOpen(false); await load(); setSuccess(`Cliente ${wasEditing ? 'actualizado' : 'guardado'} correctamente.`); } catch (err) { window.alert(err instanceof Error ? err.message : 'No se pudo guardar el cliente'); } };
  const remove = async (item: Cliente) => { try { await deleteCliente(item.id); await load(); } catch (err) { window.alert(err instanceof Error ? err.message : 'No se pudo eliminar el cliente'); } };
  const openSales = async (client: Cliente) => { setSalesClient(client); setSalesLoading(true); try { setSales((await fetchPedidos()).filter((sale) => sale.clienteId === client.id)); } catch (err) { window.alert(err instanceof Error ? err.message : 'No se pudieron cargar las ventas.'); setSales([]); } finally { setSalesLoading(false); } };

  return <div><div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 className="font-serif text-2xl font-semibold text-ink">Clientes</h1><p className="text-sm text-ink/55">{items.length} en total · Doble clic para ver sus ventas</p></div><div className="flex gap-3"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar clientes..." className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold focus:outline-none" /><button type="button" onClick={openNew} className="rounded-sm bg-amatista-deep px-5 py-2.5 text-sm text-cream hover:bg-amatista-mid">+ Nuevo cliente</button></div></div>{loading && <p className="rounded-sm border border-ink/10 bg-white px-4 py-3 text-sm text-ink/55">Cargando clientes...</p>}{!loading && error && <p className="rounded-sm border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">{error}</p>}{success && <p role="status" className="mb-4 rounded-sm border border-success/25 bg-success/10 px-4 py-3 text-sm text-success">{success}</p>}{!loading && !error && <DataTable columns={columns} rows={filtered} onEdit={openEdit} onDelete={remove} onRowDoubleClick={openSales} />}<Modal open={modalOpen} title={editing ? 'Actualizar cliente' : 'Agregar cliente'} onClose={() => setModalOpen(false)}><form onSubmit={submit} className="flex flex-col gap-4">{fields.map((field) => <FormField key={field.key} field={field} value={(form as Record<string, unknown>)[field.key]} onChange={(key, value) => setForm((old) => ({ ...old, [key]: value }))} />)}<div className="mt-2 flex justify-center gap-3"><button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-ink/60">Cancelar</button><button type="submit" className="rounded-sm bg-gold px-6 py-2.5 text-sm text-ink hover:bg-gold-light">Guardar</button></div></form></Modal><Modal open={Boolean(salesClient)} title={`Ventas de ${salesClient?.nombre ?? ''}`} onClose={() => setSalesClient(null)}>{salesLoading ? <p className="py-8 text-center text-sm text-ink/55">Cargando ventas...</p> : sales.length === 0 ? <p className="py-8 text-center text-sm text-ink/55">Este cliente aún no tiene ventas asignadas.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-sm"><thead><tr className="border-b border-ink/10 bg-cream/70 text-left text-[.72rem] uppercase tracking-wide text-ink/55"><th className="px-4 py-3">Código de venta</th><th className="px-4 py-3">Fecha</th><th className="px-4 py-3">Método de pago</th><th className="px-4 py-3 text-right">Total a pagar</th></tr></thead><tbody>{sales.map((sale) => <tr key={sale.id} className="border-b border-ink/8 last:border-0"><td className="px-4 py-3 font-medium">{sale.codigo}</td><td className="px-4 py-3">{sale.fecha}</td><td className="px-4 py-3 text-right font-serif font-semibold">{sale.formaPago}</td><td className="px-4 py-3 text-right font-serif font-semibold">{money(sale.total)}</td></tr>)}</tbody></table></div>}</Modal></div>;
}
