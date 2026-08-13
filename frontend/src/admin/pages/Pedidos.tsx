import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { DataTable, type ColumnConfig } from '../components/DataTable';
import { Modal } from '../components/Modal';
import type { Cliente, LineaVenta, Pedido, ProductoAdmin } from '../types';
import { fetchClientes } from '../../services/clientes';
import { fetchProductos } from '../../services/productos';
import { createPedido, deletePedido, fetchPedidos, updatePedido } from '../../services/pedidos';

const formas = ['Transferencia', 'Nequi', 'Daviplata', 'Efectivo', 'Tarjeta'];
const money = (value: number) => `$${value.toLocaleString('es-CO')}`;
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date());

type Form = { clienteId: string; formaPago: string; notas: string; productos: LineaVenta[] };
const emptyForm = (): Form => ({ clienteId: '', formaPago: 'Transferencia', notas: '', productos: [] });

export default function PedidosPage() {
  const [items, setItems] = useState<Pedido[]>([]);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [products, setProducts] = useState<ProductoAdmin[]>([]);
  const [form, setForm] = useState<Form>(emptyForm);
  const [editing, setEditing] = useState<Pedido | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [clientQuery, setClientQuery] = useState('');
  const [productQuery, setProductQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const load = async () => {
    try {
      setError('');
      const [sales, loadedClients, loadedProducts] = await Promise.all([fetchPedidos(), fetchClientes(), fetchProductos()]);
      setItems(sales); setClients(loadedClients); setProducts(loadedProducts);
    } catch (err) { setError(err instanceof Error ? err.message : 'No se pudieron cargar las ventas.'); }
  };
  useEffect(() => { void load(); }, []);

  const selectedClient = clients.find((client) => client.id === form.clienteId);
  const matchingClients = clientQuery.trim() && !selectedClient ? clients.filter((client) => `${client.nombre} ${client.telefono} ${client.email}`.toLocaleLowerCase().includes(clientQuery.toLocaleLowerCase())).slice(0, 6) : [];
  const matchingProducts = productQuery.trim() ? products.filter((product) => product.nombre.toLocaleLowerCase().includes(productQuery.toLocaleLowerCase())).slice(0, 6) : [];
  const total = useMemo(() => form.productos.reduce((sum, product) => sum + product.precioUnitario * product.cantidad, 0), [form.productos]);
  const clientName = (id: string) => clients.find((client) => client.id === id)?.nombre ?? 'Cliente eliminado';
  const filteredItems = useMemo(() => items.filter((sale) => [sale.codigo, sale.formaPago, clientName(sale.clienteId)].some((value) => value.toLowerCase().includes(searchQuery.toLowerCase()))), [items, clients, searchQuery]);

  const columns: ColumnConfig<Pedido>[] = [
    { key: 'codigo', label: 'Código' }, { key: 'fecha', label: 'Fecha' },
    { key: 'clienteId', label: 'Cliente', render: (sale) => clientName(sale.clienteId) },
    { key: 'productos', label: 'Productos', render: (sale) => `${sale.productos.reduce((sum, line) => sum + line.cantidad, 0)} unidades` },
    { key: 'formaPago', label: 'Pago' },
    { key: 'total', label: 'Total', render: (sale) => money(sale.total) },
  ];

  const openNew = () => { setEditing(null); setForm(emptyForm()); setClientQuery(''); setProductQuery(''); setOpen(true); };
  const openEdit = (sale: Pedido) => { setEditing(sale); setForm({ clienteId: sale.clienteId, formaPago: sale.formaPago, notas: sale.notas ?? '', productos: sale.productos }); setClientQuery(clientName(sale.clienteId)); setProductQuery(''); setOpen(true); };
  const selectClient = (client: Cliente) => { setForm((current) => ({ ...current, clienteId: client.id })); setClientQuery(client.nombre); };
  const addProduct = (product: ProductoAdmin) => {
    if (product.stock < 1) return;
    setForm((current) => current.productos.some((line) => line.productoId === product.id) ? current : { ...current, productos: [...current.productos, { productoId: product.id, nombre: product.nombre, precioUnitario: product.precio, cantidad: 1, subtotal: product.precio }] });
    setProductQuery('');
  };
  const setQuantity = (productId: string, value: number) => setForm((current) => ({ ...current, productos: current.productos.map((line) => line.productoId === productId ? { ...line, cantidad: Math.max(1, value), subtotal: line.precioUnitario * Math.max(1, value) } : line) }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.clienteId) return window.alert('Busca y selecciona un cliente antes de guardar.');
    if (!form.productos.length) return window.alert('Agrega al menos un producto a la venta.');
    try {
      const payload = { clienteId: form.clienteId, formaPago: form.formaPago, notas: form.notas, productos: form.productos.map(({ productoId, cantidad }) => ({ productoId, cantidad })) };
      const wasEditing = Boolean(editing);
      if (editing) await updatePedido(editing.id, payload); else await createPedido(payload);
      setOpen(false); await load(); setSuccess(`Venta ${wasEditing ? 'actualizada' : 'guardada'} correctamente.`);
    } catch (err) { window.alert(err instanceof Error ? err.message : 'No se pudo guardar la venta.'); }
  };

  return <div>
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><h1 className="font-serif text-2xl font-semibold text-ink">Ventas</h1><p className="text-sm text-ink/55">{items.length} registradas</p></div><div className="flex flex-wrap gap-3"><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Buscar ventas..." className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold focus:outline-none"/><button type="button" onClick={openNew} className="rounded-sm bg-amatista-deep px-5 py-2.5 text-sm text-cream">+ Nueva venta</button></div></div>
    {error && <p className="mb-4 text-danger">{error}</p>}
    {success && <p role="status" className="mb-4 rounded-sm border border-success/25 bg-success/10 px-4 py-3 text-sm text-success">{success}</p>}
    <DataTable columns={columns} rows={filteredItems} onEdit={openEdit} onDelete={async (sale) => { try { await deletePedido(sale.id); await load(); } catch (err) { window.alert(err instanceof Error ? err.message : 'No se pudo eliminar la venta.'); } }} emptyLabel="Aún no hay ventas registradas." />
    <Modal open={open} title={editing ? `Editar venta ${editing.codigo}` : 'Registrar venta'} onClose={() => setOpen(false)} size="wide">
      <form onSubmit={submit} className="grid gap-5 lg:grid-cols-[1.05fr_1.45fr]">
        <div className="space-y-4"><div className="grid grid-cols-2 gap-3"><label><span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">Fecha</span><input readOnly value={editing?.fecha ?? today()} className="w-full rounded-sm border border-ink/10 bg-cream px-3 py-2.5 text-sm text-ink/60" /></label><label><span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">Código</span><input readOnly value={editing?.codigo ?? 'Se genera al guardar'} className="w-full rounded-sm border border-ink/10 bg-cream px-3 py-2.5 text-sm text-ink/60" /></label></div>
          <label><span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">Buscar cliente</span><input value={clientQuery} onChange={(event) => { setClientQuery(event.target.value); setForm((current) => ({ ...current, clienteId: '' })); }} placeholder="Nombre, teléfono o correo" autoComplete="off" className="w-full rounded-sm border border-ink/15 bg-white px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none" /></label>
          {matchingClients.length > 0 && <div className="max-h-40 overflow-y-auto rounded-sm border border-ink/10">{matchingClients.map((client) => <button type="button" key={client.id} onClick={() => selectClient(client)} className="block w-full border-b border-ink/10 px-3 py-2 text-left text-sm last:border-0 hover:bg-cream"><strong>{client.nombre}</strong><span className="block text-xs text-ink/55">{client.telefono} · {client.email}</span></button>)}</div>}
          {selectedClient && <div className="rounded-sm bg-cream px-3 py-2 text-sm">Cliente: <strong>{selectedClient.nombre}</strong></div>}
          <label><span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">Forma de pago</span><select value={form.formaPago} onChange={(event) => setForm((current) => ({ ...current, formaPago: event.target.value }))} className="w-full rounded-sm border border-ink/15 bg-white px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none">{formas.map((value) => <option key={value}>{value}</option>)}</select></label>
        </div>
        <div className="space-y-4"><div><label><span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">Agregar productos</span><input value={productQuery} onChange={(event) => setProductQuery(event.target.value)} placeholder="Buscar por nombre" autoComplete="off" className="w-full rounded-sm border border-ink/15 bg-white px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none" /></label>{productQuery && <div className="mt-1 max-h-40 overflow-y-auto rounded-sm border border-ink/10">{matchingProducts.length === 0 ? <p className="px-3 py-2 text-sm text-ink/55">No hay productos coincidentes.</p> : matchingProducts.map((product) => <button type="button" key={product.id} disabled={product.stock < 1} onClick={() => addProduct(product)} className="flex w-full items-center justify-between border-b border-ink/10 px-3 py-2.5 text-left text-sm last:border-0 hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50"><span><strong>{product.nombre}</strong><span className="block text-xs text-ink/55">{money(product.precio)}</span></span><span className={product.stock > 0 ? 'text-success' : 'text-danger'}>{product.stock > 0 ? `${product.stock} disponibles` : 'No disponible'}</span></button>)}</div>}</div>
          <div className="overflow-x-auto rounded-sm border border-ink/10"><table className="w-full min-w-[460px] text-sm"><thead className="bg-cream text-left text-[.68rem] uppercase tracking-wide text-ink/55"><tr><th className="px-3 py-2">Producto</th><th className="px-3 py-2">Unitario</th><th className="px-3 py-2">Cantidad</th><th className="px-3 py-2">Total</th><th /></tr></thead><tbody>{form.productos.length === 0 ? <tr><td colSpan={5} className="px-3 py-7 text-center text-ink/50">Busca y agrega productos a la venta.</td></tr> : form.productos.map((line) => <tr key={line.productoId} className="border-t border-ink/8"><td className="px-3 py-3 font-medium">{line.nombre}</td><td className="px-3 py-3">{money(line.precioUnitario)}</td><td className="px-3 py-3"><input type="number" min="1" value={line.cantidad} onChange={(event) => setQuantity(line.productoId, Number(event.target.value))} className="w-16 rounded-sm border border-ink/15 px-2 py-1.5" /></td><td className="px-3 py-3 font-medium">{money(line.precioUnitario * line.cantidad)}</td><td className="px-3 py-3"><button type="button" onClick={() => setForm((current) => ({ ...current, productos: current.productos.filter((item) => item.productoId !== line.productoId) }))} className="text-xs text-danger">Quitar</button></td></tr>)}</tbody></table></div>
          <div className="flex items-center justify-between border-t border-ink/10 pt-4 font-serif text-lg"><span>Total a pagar</span><strong>{money(total)}</strong></div>
          <label><span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">Observación o nota</span><textarea value={form.notas} onChange={(event) => setForm((current) => ({ ...current, notas: event.target.value }))} rows={3} className="w-full rounded-sm border border-ink/15 px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none" /></label>
          <div className="flex justify-center"><button className="rounded-sm bg-gold px-6 py-2.5 text-sm text-ink">Guardar venta</button></div>
        </div>
      </form>
    </Modal>
  </div>;
}
