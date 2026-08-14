import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { DataTable, type ColumnConfig } from '../components/DataTable';
import { Modal } from '../components/Modal';
import type { Cliente, Pedido, PagoVenta, ProductoAdmin } from '../types';
import { fetchClientes } from '../../services/clientes';
import { fetchProductos } from '../../services/productos';
import { createPedido, deletePedido, fetchPedidos, updatePedido, fetchPagosPedido, createPagoPedido } from '../../services/pedidos';
import type { CreateInput } from '../../services/pedidos';

const money = (value: number) => `$${value.toLocaleString('es-CO')}`;
const ESTADOS: ('Pendiente' | 'Completado')[] = ['Pendiente', 'Completado'];

type ProductoItem = { productoId: string; cantidad: number };
type PedidoForm = Omit<CreateInput, 'productos'> & { productos: ProductoItem[]; pagoInicial: number };
const EMPTY_FORM: PedidoForm = { clienteId: '', formaPago: '', notas: '', productos: [], pagoInicial: 0 };
const emptyProducto = (): ProductoItem => ({ productoId: '', cantidad: 1 });

export default function PedidosPage() {
  const [items, setItems] = useState<Pedido[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<ProductoAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Pendiente' | 'Completado'>('Todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Pedido | null>(null);
  const [form, setForm] = useState<PedidoForm>(EMPTY_FORM);
  const [clienteQuery, setClienteQuery] = useState('');
  const [productoQueries, setProductoQueries] = useState<string[]>(['']);
  const [pagosModalOpen, setPagosModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [pagos, setPagos] = useState<PagoVenta[]>([]);
  const [pagosLoading, setPagosLoading] = useState(false);
  const [nuevoPagoMonto, setNuevoPagoMonto] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const [loadedPedidos, loadedClientes, loadedProductos] = await Promise.all([
        fetchPedidos(), 
        fetchClientes(), 
        fetchProductos()
      ]);
      setItems(loadedPedidos);
      setClientes(loadedClientes);
      setProductos(loadedProductos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las ventas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => 
      (statusFilter === 'Todos' || item.estado === statusFilter) &&
      [item.codigo, item.formaPago, item.estado].some((value) => 
        String(value).toLowerCase().includes(term)
      )
    );
  }, [items, query, statusFilter]);

  const clientesMap = useMemo(() => 
    new Map(clientes.map((c) => [c.id, c.nombre])), 
    [clientes]
  );

  const productosMap = useMemo(() => 
    new Map(productos.map((p) => [p.id, p])), 
    [productos]
  );

  const selectedClient = clientes.find((client) => client.id === form.clienteId);
  const matchingClients = clienteQuery.trim() && !selectedClient
    ? clientes.filter((client) => client.nombre.toLocaleLowerCase().includes(clienteQuery.toLocaleLowerCase())).slice(0, 6)
    : [];

  const matchingProducts = (index: number) => {
    const query = productoQueries[index]?.trim();
    const selectedProduct = productos.find((product) => product.id === form.productos[index]?.productoId);
    return query && !selectedProduct
      ? productos.filter((product) => product.nombre.toLocaleLowerCase().includes(query.toLocaleLowerCase())).slice(0, 6)
      : [];
  };

  const totalVenta = useMemo(() => {
    return form.productos.reduce((sum, item) => {
      const producto = productosMap.get(item.productoId);
      if (!producto) return sum;
      return sum + (producto.precio * item.cantidad);
    }, 0);
  }, [form.productos, productosMap]);

  const columns: ColumnConfig<Pedido>[] = [
    { 
      key: 'codigo', 
      label: 'Código',
      render: (row) => <span className="font-mono text-xs">{row.codigo}</span>
    },
    { 
      key: 'fecha', 
      label: 'Fecha',
      render: (row) => new Date(row.fecha).toLocaleDateString('es-CO')
    },
    { 
      key: 'clienteId', 
      label: 'Cliente',
      render: (row) => clientesMap.get(row.clienteId) || '—'
    },
    { 
      key: 'total', 
      label: 'Total',
      render: (row) => money(row.total),
      className: 'text-right'
    },
    { 
      key: 'totalPagado', 
      label: 'Ha pagado',
      render: (row) => money(row.totalPagado),
      className: 'text-right'
    },
    { 
      key: 'debe', 
      label: 'Debe',
      render: (row) => (
        <span className={row.debe > 0 ? 'text-danger' : 'text-success'}>
          {money(row.debe)}
        </span>
      ),
      className: 'text-right'
    },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (row) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${
          row.estado === 'Completado' 
            ? 'bg-success/10 text-success' 
            : 'bg-warning/10 text-warning'
        }`}>
          {row.estado}
        </span>
      )
    },
  ];

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setClienteQuery('');
    setProductoQueries(['']);
    setModalOpen(true);
  };

  const openEdit = (item: Pedido) => {
    setEditing(item);
    const productosList = item.productos.map(p => ({ productoId: p.productoId, cantidad: p.cantidad }));
    setForm({ 
      clienteId: item.clienteId, 
      formaPago: item.formaPago, 
      notas: item.notas ?? '',
      productos: productosList,
      pagoInicial: 0
    });
    setClienteQuery(clientesMap.get(item.clienteId) ?? '');
    setProductoQueries(productosList.map(p => productosMap.get(p.productoId)?.nombre ?? ''));
    setModalOpen(true);
  };

  const selectClient = (client: Cliente) => {
    setForm((prev) => ({ ...prev, clienteId: client.id }));
    setClienteQuery(client.nombre);
  };

  const selectProduct = (index: number, product: ProductoAdmin) => {
    setForm((prev) => ({
      ...prev,
      productos: prev.productos.map((item, i) => 
        i === index ? { ...item, productoId: product.id } : item
      )
    }));
    setProductoQueries((current) => current.map((query, i) => i === index ? product.nombre : query));
  };

  const addProducto = () => {
    setForm((prev) => ({ ...prev, productos: [...prev.productos, emptyProducto()] }));
    setProductoQueries((current) => [...current, '']);
  };

  const removeProducto = (index: number) => {
    setForm((prev) => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index)
    }));
    setProductoQueries((current) => current.filter((_, i) => i !== index));
  };

  const updateProducto = (index: number, field: 'cantidad', value: number) => {
    setForm((prev) => ({
      ...prev,
      productos: prev.productos.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (form.productos.length === 0) {
      window.alert('Debes agregar al menos un producto a la venta');
      return;
    }
    try {
      const wasEditing = Boolean(editing);
      if (editing) {
        await updatePedido(editing.id, form);
      } else {
        await createPedido(form);
      }
      setModalOpen(false);
      await load();
      setSuccess(`Venta ${wasEditing ? 'actualizada' : 'guardada'} correctamente.`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'No se pudo guardar la venta');
    }
  };

  const openPagos = async (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setPagosLoading(true);
    setPagosModalOpen(true);
    try {
      setPagos(await fetchPagosPedido(pedido.id));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'No se pudieron cargar los pagos');
      setPagos([]);
    } finally {
      setPagosLoading(false);
    }
  };

  const handleNuevoPago = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPedido) return;
    
    const monto = parseFloat(nuevoPagoMonto);
    if (isNaN(monto) || monto <= 0) {
      window.alert('El monto debe ser mayor a 0');
      return;
    }

    try {
      await createPagoPedido(selectedPedido.id, monto);
      setNuevoPagoMonto('');
      await load();
      setPagos(await fetchPagosPedido(selectedPedido.id));
      setSuccess('Pago registrado correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'No se pudo registrar el pago');
    }
  };

  const remove = async (item: Pedido) => {
    try {
      await deletePedido(item.id);
      await load();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'No se pudo eliminar la venta');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Ventas</h1>
          <p className="text-sm text-ink/55">{items.length} en total</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={openNew}
            className="rounded-sm bg-amatista-deep px-5 py-2.5 text-sm text-cream hover:bg-amatista-mid"
          >
            + Nueva venta
          </button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar ventas..."
          className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
        />
        <div className="flex flex-wrap gap-2">
          {(['Todos', ...ESTADOS] as const).map((state) => (
            <button
              type="button"
              key={state}
              onClick={() => setStatusFilter(state)}
              className={`rounded-full border px-4 py-2 text-xs ${
                statusFilter === state
                  ? 'border-amatista-deep bg-amatista-deep text-cream'
                  : 'border-ink/15 text-ink/60 hover:border-gold'
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <p className="rounded-sm border border-ink/10 bg-white px-4 py-3 text-sm text-ink/55">
          Cargando ventas...
        </p>
      )}
      {!loading && error && (
        <p className="rounded-sm border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="mb-4 rounded-sm border border-success/25 bg-success/10 px-4 py-3 text-sm text-success">
          {success}
        </p>
      )}
      {!loading && !error && (
        <DataTable 
          columns={columns} 
          rows={filtered} 
          onEdit={openEdit} 
          onDelete={remove}
          onPayment={openPagos}
        />
      )}

      {/* Modal de pagos */}
      <Modal 
        open={pagosModalOpen} 
        title={`Pagos - ${selectedPedido?.codigo ?? ''}`} 
        onClose={() => {
          setPagosModalOpen(false);
          setSelectedPedido(null);
          setPagos([]);
          setNuevoPagoMonto('');
        }}
      >
        <div className="space-y-4">
          <div className="flex justify-between rounded-sm bg-cream/50 p-3 text-sm">
            <span className="text-ink/70">Total:</span>
            <span className="font-medium">{selectedPedido && money(selectedPedido.total)}</span>
          </div>
          <div className="flex justify-between rounded-sm bg-cream/50 p-3 text-sm">
            <span className="text-ink/70">Pagado:</span>
            <span className="font-medium text-success">{selectedPedido && money(selectedPedido.totalPagado)}</span>
          </div>
          <div className="flex justify-between rounded-sm bg-cream/50 p-3 text-sm">
            <span className="text-ink/70">Pendiente:</span>
            <span className={`font-medium ${selectedPedido?.debe && selectedPedido.debe > 0 ? 'text-danger' : 'text-success'}`}>
              {selectedPedido ? money(selectedPedido.debe) : '$0'}
            </span>
          </div>

          {pagosLoading && (
            <p className="text-center text-sm text-ink/55">Cargando pagos...</p>
          )}

          {!pagosLoading && pagos.length > 0 && (
            <div className="max-h-60 overflow-y-auto rounded-sm border border-ink/10">
              <table className="w-full text-sm">
                <thead className="bg-cream/70">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs uppercase text-ink/55">Código</th>
                    <th className="px-3 py-2 text-left text-xs uppercase text-ink/55">Fecha</th>
                    <th className="px-3 py-2 text-right text-xs uppercase text-ink/55">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((pago) => (
                    <tr key={pago.id} className="border-b border-ink/6 last:border-0">
                      <td className="px-3 py-2 font-mono text-xs">{pago.codigo}</td>
                      <td className="px-3 py-2">{new Date(pago.fecha).toLocaleDateString('es-CO')}</td>
                      <td className="px-3 py-2 text-right">{money(pago.monto)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!pagosLoading && pagos.length === 0 && (
            <p className="text-center text-sm text-ink/50">No hay pagos registrados</p>
          )}

          {selectedPedido && (selectedPedido.debe ?? 0) > 0 && (
            <form onSubmit={handleNuevoPago} className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                max={selectedPedido.debe ?? 0}
                value={nuevoPagoMonto}
                onChange={(e) => setNuevoPagoMonto(e.target.value)}
                placeholder={`Monto (máx: ${money(selectedPedido.debe ?? 0)})`}
                className="flex-1 rounded-sm border border-ink/15 px-3 py-2 text-sm focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-sm bg-success px-4 py-2 text-sm text-white hover:bg-success/90"
              >
                + Pago
              </button>
            </form>
          )}
        </div>
      </Modal>

      {/* Modal para crear/editar venta */}
      <Modal 
        open={modalOpen} 
        title={editing ? 'Editar venta' : 'Nueva venta'} 
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
          setForm(EMPTY_FORM);
          setClienteQuery('');
          setProductoQueries(['']);
        }}
        size="wide"
      >
        <form onSubmit={submit} className="space-y-6">
          {/* Cliente y forma de pago */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">Buscar cliente</span>
                <input 
                  required 
                  value={clienteQuery} 
                  onChange={(event) => { setClienteQuery(event.target.value); setForm((prev) => ({ ...prev, clienteId: '' })); }} 
                  placeholder="Buscar por nombre" 
                  autoComplete="off" 
                  className="w-full rounded-sm border border-ink/15 bg-white px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none" 
                />
              </label>
              {matchingClients.length > 0 && (
                <div className="mt-1 max-h-40 overflow-y-auto rounded-sm border border-ink/10 bg-white">
                  {matchingClients.map((client) => (
                    <button 
                      type="button" 
                      key={client.id} 
                      onClick={() => selectClient(client)} 
                      className="block w-full border-b border-ink/10 px-3 py-2 text-left text-sm last:border-0 hover:bg-cream"
                    >
                      <strong>{client.nombre}</strong>
                      <span className="block text-xs text-ink/55">{client.ciudad} · {client.telefono}</span>
                    </button>
                  ))}
                </div>
              )}
              {clienteQuery && !selectedClient && matchingClients.length === 0 && (
                <p className="mt-1 text-xs text-ink/55">No hay clientes coincidentes.</p>
              )}
              {selectedClient && (
                <p className="mt-2 rounded-sm bg-cream px-3 py-2 text-sm">Cliente: <strong>{selectedClient.nombre}</strong></p>
              )}
            </div>
            <div>
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">Forma de pago</span>
                <select
                  required
                  value={form.formaPago}
                  onChange={(e) => setForm((prev) => ({ ...prev, formaPago: e.target.value }))}
                  className="w-full rounded-sm border border-ink/15 bg-white px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none"
                >
                  <option value="" disabled>Selecciona...</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Bancolombia">Bancolombia</option>
                  <option value="Nequi">Nequi</option>
                </select>
              </label>
            </div>
          </div>

          {/* Productos */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-ink">Productos</h3>
              <button 
                type="button" 
                onClick={addProducto} 
                className="rounded-sm border border-amatista-deep px-4 py-2 text-sm text-amatista-deep hover:bg-amatista-deep hover:text-cream"
              >
                + Agregar producto
              </button>
            </div>
            
            {form.productos.length === 0 ? (
              <p className="rounded-sm border border-ink/10 bg-cream/30 px-4 py-3 text-sm text-ink/50">
                No hay productos agregados
              </p>
            ) : (
              <div className="space-y-3">
                {form.productos.map((item, index) => {
                  const selectedProduct = productos.find((product) => product.id === item.productoId);
                  const matches = matchingProducts(index);
                  const subtotal = selectedProduct ? selectedProduct.precio * item.cantidad : 0;
                  const disponible = selectedProduct ? selectedProduct.stock : 0;
                  
                  return (
                    <div key={index} className="grid gap-3 rounded-sm border border-ink/10 bg-cream/35 p-4 md:grid-cols-[1.5fr_.8fr_.8fr_.8fr_auto]">
                      {/* Producto */}
                      <div>
                        <label>
                          <span className="mb-1 block text-xs text-ink/55">Buscar producto</span>
                          <input 
                            required 
                            value={productoQueries[index] ?? ''} 
                            onChange={(event) => { 
                              setProductoQueries((current) => current.map((query, i) => i === index ? event.target.value : query)); 
                              setForm((prev) => ({
                                ...prev,
                                productos: prev.productos.map((p, i) => i === index ? { ...p, productoId: '' } : p)
                              }));
                            }} 
                            placeholder="Buscar por nombre" 
                            autoComplete="off" 
                            className="w-full rounded-sm border border-ink/15 bg-white px-3 py-2 text-sm" 
                          />
                        </label>
                        {matches.length > 0 && (
                          <div className="relative z-10 mt-1 max-h-32 overflow-y-auto rounded-sm border border-ink/10 bg-white">
                            {matches.map((product) => (
                              <button 
                                type="button" 
                                key={product.id} 
                                onClick={() => selectProduct(index, product)} 
                                className="block w-full border-b border-ink/10 px-3 py-2 text-left text-sm last:border-0 hover:bg-cream"
                              >
                                <strong>{product.nombre}</strong>
                                <span className="block text-xs text-ink/55">{money(product.precio)} · Stock: {product.stock}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {(productoQueries[index] ?? '') && !selectedProduct && matches.length === 0 && (
                          <p className="mt-1 text-xs text-ink/55">No hay productos coincidentes.</p>
                        )}
                        {selectedProduct && (
                          <p className="mt-2 rounded-sm bg-cream px-3 py-2 text-sm">Producto: <strong>{selectedProduct.nombre}</strong></p>
                        )}
                      </div>
                      
                      {/* Cantidad */}
                      <div>
                        <label>
                          <span className="mb-1 block text-xs text-ink/55">Cantidad</span>
                          <input 
                            required 
                            min="1" 
                            max={disponible}
                            type="number" 
                            value={item.cantidad === 0 ? '' : item.cantidad} 
                            onChange={(event) => updateProducto(index, 'cantidad', event.target.value === '' ? 0 : parseInt(event.target.value) || 0)} 
                            placeholder="1"
                            className="w-full rounded-sm border border-ink/15 bg-white px-3 py-2 text-sm" 
                          />
                        </label>
                        {selectedProduct && (
                          <p className="mt-1 text-xs text-ink/55">Disponible: {disponible}</p>
                        )}
                      </div>
                      
                      {/* Precio unitario */}
                      <div>
                        <label>
                          <span className="mb-1 block text-xs text-ink/55">Precio unitario</span>
                          <div className="rounded-sm bg-cream/50 px-3 py-2 text-sm">
                            {selectedProduct ? money(selectedProduct.precio) : '$0'}
                          </div>
                        </label>
                      </div>
                      
                      {/* Subtotal */}
                      <div>
                        <label>
                          <span className="mb-1 block text-xs text-ink/55">Subtotal</span>
                          <div className="rounded-sm bg-cream/50 px-3 py-2 text-sm font-medium">
                            {money(subtotal)}
                          </div>
                        </label>
                      </div>
                      
                      {/* Eliminar */}
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeProducto(index)}
                          className="text-danger hover:opacity-70"
                        >
                          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                            <path d="M4 7h16M9 7V4h6v3m-9 0 1 14h10l1-14M10 11v6m4-6v6"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Resumen */}
          <div className="grid gap-3 rounded-sm bg-cream p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <p>
              <span className="block text-xs text-ink/55">Total a pagar</span>
              <strong>{money(totalVenta)}</strong>
            </p>
            <p>
              <span className="block text-xs text-ink/55">Pago inicial</span>
              <strong>{money(form.pagoInicial ?? 0)}</strong>
            </p>
            <p>
              <span className="block text-xs text-ink/55">Saldo pendiente</span>
              <strong className={totalVenta - (form.pagoInicial ?? 0) > 0 ? 'text-danger' : 'text-success'}>
                {money(totalVenta - (form.pagoInicial ?? 0))}
              </strong>
            </p>
            <p>
              <span className="block text-xs text-ink/55">Productos</span>
              <strong>{form.productos.length}</strong>
            </p>
          </div>

          {/* Pago inicial */}
          <div>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">Cuánto va a pagar (inicial)</span>
              <input
                type="number"
                min="0"
                max={totalVenta}
                step="0.01"
                value={form.pagoInicial === 0 ? '' : form.pagoInicial}
                onChange={(e) => setForm((prev) => ({ ...prev, pagoInicial: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 }))}
                placeholder="Monto del pago inicial"
                className="w-full rounded-sm border border-ink/15 bg-white px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none"
              />
            </label>
          </div>

          {/* Notas */}
          <div>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">Notas (opcional)</span>
              <textarea
                className="w-full rounded-sm border border-ink/15 bg-white px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none min-h-[90px] resize-y"
                value={form.notas}
                onChange={(e) => setForm((prev) => ({ ...prev, notas: e.target.value }))}
                placeholder="Notas adicionales..."
              />
            </label>
          </div>

          <div className="flex justify-center gap-3">
            <button 
              type="button" 
              onClick={() => setModalOpen(false)} 
              className="px-5 py-2.5 text-sm text-ink/60"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="rounded-sm bg-gold px-6 py-2.5 text-sm text-ink"
            >
              Guardar venta
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}