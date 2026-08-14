import { useEffect, useState, type FormEvent } from 'react';
import { DataTable, type ColumnConfig } from '../components/DataTable';
import { Modal } from '../components/Modal';
import type { CostoProduccion, MaterialCosto, ProductoAdmin, Proveedor, EventoAdmin } from '../types';
import { createCosto, deleteCosto, fetchCostos, updateCosto } from '../../services/costos';
import { fetchProductos } from '../../services/productos';
import { fetchProveedores } from '../../services/proveedores';
import { fetchEventos } from '../../services/eventos';

const money = (value: number) => `$${Math.round(value).toLocaleString('es-CO')}`;
const emptyMaterial = (): MaterialCosto => ({ proveedorId: '', descripcion: '', cantidad: '', valor: 0 });

type TipoCosto = 'producto' | 'taller';

export default function CostosPage() {
  const [items, setItems] = useState<CostoProduccion[]>([]);
  const [products, setProducts] = useState<ProductoAdmin[]>([]);
  const [events, setEvents] = useState<EventoAdmin[]>([]);
  const [providers, setProviders] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CostoProduccion | null>(null);
  const [tipoCosto, setTipoCosto] = useState<TipoCosto>('producto');
  const [productId, setProductId] = useState('');
  const [eventId, setEventId] = useState('');
  const [productQuery, setProductQuery] = useState('');
  const [eventQuery, setEventQuery] = useState('');
  const [providerQueries, setProviderQueries] = useState<string[]>(['']);
  const [quantityProduced, setQuantityProduced] = useState(1);
  const [materials, setMaterials] = useState<MaterialCosto[]>([emptyMaterial()]);

  const load = async () => {
    try {
      setLoading(true); setError('');
      const [costs, loadedProducts, loadedProviders, loadedEvents] = await Promise.all([fetchCostos(), fetchProductos(), fetchProveedores(), fetchEventos()]);
      setItems(costs); setProducts(loadedProducts); setProviders(loadedProviders); setEvents(loadedEvents);
    } catch (err) { setError(err instanceof Error ? err.message : 'No se pudo cargar la información de costos.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const selectedProduct = products.find((product) => product.id === productId);
  const selectedEvent = events.find((event) => event.id === eventId);
  const matchingProducts = productQuery.trim() && !selectedProduct
    ? products.filter((product) => product.nombre.toLocaleLowerCase().includes(productQuery.toLocaleLowerCase())).slice(0, 6)
    : [];
  const matchingEvents = eventQuery.trim() && !selectedEvent
    ? events.filter((event) => event.nombre.toLocaleLowerCase().includes(eventQuery.toLocaleLowerCase())).slice(0, 6)
    : [];
  const matchingProviders = (index: number) => {
    const query = providerQueries[index]?.trim();
    const selectedProvider = providers.find((provider) => provider.id === materials[index]?.proveedorId);
    return query && !selectedProvider
      ? providers.filter((provider) => `${provider.nombreEmpresa} ${provider.nit ?? ''} ${provider.celular} ${provider.municipio}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())).slice(0, 6)
      : [];
  };
  const total = materials.reduce((sum, material) => sum + (Number(material.valor) || 0), 0);
  const unitCost = quantityProduced > 0 ? total / quantityProduced : 0;
  const itemPrice = tipoCosto === 'producto' ? selectedProduct?.precio ?? 0 : selectedEvent?.precio ?? 0;
  const margin = itemPrice - unitCost;
  const marginPercentage = itemPrice ? margin / itemPrice * 100 : 0;
  const columns: ColumnConfig<CostoProduccion>[] = [
    { key: 'fecha', label: 'Fecha' }, 
    { key: 'productoNombre', label: 'Producto/Evento' },
    { key: 'costoUnitario', label: 'Costo', render: (item) => money(item.costoUnitario) },
    { key: 'precioProducto', label: 'Valor', render: (item) => money(item.precioProducto) },
    { key: 'margenUnitario', label: 'Margen', render: (item) => money(item.margenUnitario) },
    { key: 'margenPorcentaje', label: 'Margen %', render: (item) => `${item.margenPorcentaje.toFixed(1)}%` },
  ];

  const reset = () => { 
    setEditing(null); 
    setTipoCosto('producto');
    setProductId(''); 
    setEventId('');
    setProductQuery(''); 
    setEventQuery('');
    setQuantityProduced(1); 
    setMaterials([emptyMaterial()]); 
    setProviderQueries(['']); 
  };
  const openNew = () => { reset(); setOpen(true); };
  const openEdit = (item: CostoProduccion) => {
    setEditing(item); 
    setProductId(item.productoId); 
    setProductQuery(item.productoNombre); 
    setQuantityProduced(item.cantidadProducida);
    setMaterials(item.materiales.map(({ proveedorId, descripcion, cantidad, valor }) => ({ proveedorId, descripcion, cantidad, valor })));
    setProviderQueries(item.materiales.map((material) => material.proveedorNombre ?? providers.find((provider) => provider.id === material.proveedorId)?.nombreEmpresa ?? ''));
    setOpen(true);
  };
  const setMaterial = (index: number, key: keyof MaterialCosto, value: string | number) => setMaterials((current) => current.map((material, materialIndex) => materialIndex === index ? { ...material, [key]: value } : material));
  const selectProduct = (product: ProductoAdmin) => { setProductId(product.id); setProductQuery(product.nombre); };
  const selectEvent = (event: EventoAdmin) => { setEventId(event.id); setEventQuery(event.nombre); };
  const selectProvider = (index: number, provider: Proveedor) => {
    setMaterial(index, 'proveedorId', provider.id);
    setProviderQueries((current) => current.map((query, queryIndex) => queryIndex === index ? provider.nombreEmpresa : query));
  };
  const addMaterial = () => { setMaterials((current) => [...current, emptyMaterial()]); setProviderQueries((current) => [...current, '']); };
  const removeMaterial = (index: number) => { setMaterials((current) => current.filter((_, materialIndex) => materialIndex !== index)); setProviderQueries((current) => current.filter((_, queryIndex) => queryIndex !== index)); };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const selectedId = tipoCosto === 'producto' ? productId : eventId;
    if (!selectedId) return window.alert(`Busca y selecciona un ${tipoCosto === 'producto' ? 'producto' : 'taller'} antes de guardar.`);
    if (materials.some((material) => !material.proveedorId)) return window.alert('Busca y selecciona un proveedor para cada material.');
    try {
      const payload = { 
        productoId: selectedId, 
        tipo: tipoCosto,
        cantidadProducida: quantityProduced, 
        materiales: materials.map(({ proveedorId, descripcion, cantidad, valor }) => ({ proveedorId, descripcion, cantidad, valor: Number(valor) })) 
      };
      const wasEditing = Boolean(editing);
      if (editing) await updateCosto(editing.id, payload); else await createCosto(payload);
      setOpen(false); await load(); setSuccess(`Costo de ${tipoCosto === 'producto' ? 'producción' : 'taller'} ${wasEditing ? 'actualizado' : 'guardado'} correctamente.`);
    } catch (err) { window.alert(err instanceof Error ? err.message : 'No se pudo guardar el costo.'); }
  };
  const remove = async (item: CostoProduccion) => { try { await deleteCosto(item.id); await load(); } catch (err) { window.alert(err instanceof Error ? err.message : 'No se pudo eliminar el costo.'); } };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Costos operativos</h1>
          <p className="text-sm text-ink/55">Registra los materiales usados para productos y talleres.</p>
        </div>
        <button type="button" onClick={openNew} className="rounded-sm bg-amatista-deep px-5 py-2.5 text-sm text-cream hover:bg-amatista-mid">
          + Agregar costo
        </button>
      </div>
      {loading && <p className="rounded-sm border border-ink/10 bg-white px-4 py-3 text-sm text-ink/55">Cargando costos...</p>}
      {!loading && error && <p className="rounded-sm border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">{error}</p>}
      {success && <p role="status" className="mb-4 rounded-sm border border-success/25 bg-success/10 px-4 py-3 text-sm text-success">{success}</p>}
      {!loading && !error && <DataTable columns={columns} rows={items} onEdit={openEdit} onDelete={remove} emptyLabel="Aún no hay costos registrados." />}
      
      <Modal open={open} title={editing ? 'Actualizar costo' : 'Agregar costo'} onClose={() => setOpen(false)} size="wide">
        <form onSubmit={submit} className="space-y-6">
          {/* Tipo de costo */}
          <div>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">Tipo de costo</span>
              <select
                value={tipoCosto}
                onChange={(e) => {
                  setTipoCosto(e.target.value as TipoCosto);
                  setProductId('');
                  setEventId('');
                  setProductQuery('');
                  setEventQuery('');
                }}
                className="w-full rounded-sm border border-ink/15 bg-white px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none"
              >
                <option value="producto">Producto</option>
                <option value="taller">Taller (Evento)</option>
              </select>
            </label>
          </div>

          {/* Búsqueda de producto o evento */}
          <div className="grid gap-4 sm:grid-cols-2">
            {tipoCosto === 'producto' ? (
              <div>
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">Buscar producto</span>
                  <input 
                    required 
                    value={productQuery} 
                    onChange={(event) => { setProductQuery(event.target.value); setProductId(''); }} 
                    placeholder="Buscar por nombre" 
                    autoComplete="off" 
                    className="w-full rounded-sm border border-ink/15 bg-white px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none" 
                  />
                </label>
                {matchingProducts.length > 0 && (
                  <div className="mt-1 max-h-40 overflow-y-auto rounded-sm border border-ink/10 bg-white">
                    {matchingProducts.map((product) => (
                      <button 
                        type="button" 
                        key={product.id} 
                        onClick={() => selectProduct(product)} 
                        className="block w-full border-b border-ink/10 px-3 py-2 text-left text-sm last:border-0 hover:bg-cream"
                      >
                        <strong>{product.nombre}</strong>
                        <span className="block text-xs text-ink/55">{money(product.precio)}</span>
                      </button>
                    ))}
                  </div>
                )}
                {productQuery && !selectedProduct && matchingProducts.length === 0 && (
                  <p className="mt-1 text-xs text-ink/55">No hay productos coincidentes.</p>
                )}
                {selectedProduct && (
                  <p className="mt-2 rounded-sm bg-cream px-3 py-2 text-sm">Producto: <strong>{selectedProduct.nombre}</strong></p>
                )}
              </div>
            ) : (
              <div>
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">Buscar taller/evento</span>
                  <input 
                    required 
                    value={eventQuery} 
                    onChange={(event) => { setEventQuery(event.target.value); setEventId(''); }} 
                    placeholder="Buscar por nombre" 
                    autoComplete="off" 
                    className="w-full rounded-sm border border-ink/15 bg-white px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none" 
                  />
                </label>
                {matchingEvents.length > 0 && (
                  <div className="mt-1 max-h-40 overflow-y-auto rounded-sm border border-ink/10 bg-white">
                    {matchingEvents.map((event) => (
                      <button 
                        type="button" 
                        key={event.id} 
                        onClick={() => selectEvent(event)} 
                        className="block w-full border-b border-ink/10 px-3 py-2 text-left text-sm last:border-0 hover:bg-cream"
                      >
                        <strong>{event.nombre}</strong>
                        <span className="block text-xs text-ink/55">{money(event.precio)} · Cupos: {event.cuposDisponibles}</span>
                      </button>
                    ))}
                  </div>
                )}
                {eventQuery && !selectedEvent && matchingEvents.length === 0 && (
                  <p className="mt-1 text-xs text-ink/55">No hay eventos coincidentes.</p>
                )}
                {selectedEvent && (
                  <p className="mt-2 rounded-sm bg-cream px-3 py-2 text-sm">Evento: <strong>{selectedEvent.nombre}</strong></p>
                )}
              </div>
            )}

            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">
                {tipoCosto === 'producto' ? 'Cantidad que produce' : 'Cantidad de cupos'}
              </span>
              <input 
                required 
                min="1" 
                type="number" 
                value={quantityProduced === 0 ? '' : quantityProduced}
                onChange={(event) => setQuantityProduced(event.target.value === '' ? 0 : Number(event.target.value))}
                className="w-full rounded-sm border border-ink/15 bg-white px-3.5 py-2.5 text-sm" 
              />
            </label>
          </div>

          {/* Materiales */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-ink">Materiales</h3>
              <button type="button" onClick={addMaterial} className="rounded-sm border border-amatista-deep px-4 py-2 text-sm text-amatista-deep hover:bg-amatista-deep hover:text-cream">
                + Agregar material
              </button>
            </div>
            <div className="space-y-3">
              {materials.map((material, index) => { 
                const selectedProvider = providers.find((provider) => provider.id === material.proveedorId); 
                const matches = matchingProviders(index); 
                return (
                  <div key={index} className="grid gap-3 rounded-sm border border-ink/10 bg-cream/35 p-4 md:grid-cols-[1.2fr_1.25fr_.8fr_.8fr_auto]">
                    <label>
                      <span className="mb-1 block text-xs text-ink/55">Material</span>
                      <input required value={material.descripcion} onChange={(event) => setMaterial(index, 'descripcion', event.target.value)} placeholder="Ej. Cera" className="w-full rounded-sm border border-ink/15 bg-white px-3 py-2 text-sm" />
                    </label>
                    <div>
                      <label>
                        <span className="mb-1 block text-xs text-ink/55">Buscar proveedor</span>
                        <input required value={providerQueries[index] ?? ''} onChange={(event) => { setProviderQueries((current) => current.map((query, queryIndex) => queryIndex === index ? event.target.value : query)); setMaterial(index, 'proveedorId', ''); }} placeholder="Empresa, NIT o ciudad" autoComplete="off" className="w-full rounded-sm border border-ink/15 bg-white px-3 py-2 text-sm" />
                      </label>
                      {matches.length > 0 && (
                        <div className="relative z-10 mt-1 max-h-32 overflow-y-auto rounded-sm border border-ink/10 bg-white">
                          {matches.map((provider) => (
                            <button type="button" key={provider.id} onClick={() => selectProvider(index, provider)} className="block w-full border-b border-ink/10 px-3 py-2 text-left text-sm last:border-0 hover:bg-cream">
                              <strong>{provider.nombreEmpresa}</strong>
                              <span className="block text-xs text-ink/55">{provider.municipio} · {provider.celular}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {(providerQueries[index] ?? '') && !selectedProvider && matches.length === 0 && (
                        <p className="mt-1 text-xs text-ink/55">No hay proveedores coincidentes.</p>
                      )}
                      {selectedProvider && (
                        <p className="mt-2 rounded-sm bg-cream px-3 py-2 text-sm">Proveedor: <strong>{selectedProvider.nombreEmpresa}</strong></p>
                      )}
                    </div>
                    <div>
                      <label>
                        <span className="mb-1 block text-xs text-ink/55">Cantidad</span>
                        <input required value={material.cantidad} onChange={(event) => setMaterial(index, 'cantidad', event.target.value)} placeholder="Ej. 1 kg" className="w-full rounded-sm border border-ink/15 bg-white px-3 py-2 text-sm" />
                      </label>
                    </div>
                    <div>
                      <label>
                        <span className="mb-1 block text-xs text-ink/55">Valor</span>
                        <input required type="number" min="0" value={material.valor === 0 ? '' : material.valor} onChange={(event) => setMaterial(index, 'valor', event.target.value === '' ? 0 : Number(event.target.value))} placeholder="0" className="w-full rounded-sm border border-ink/15 bg-white px-3 py-2 text-sm" />
                      </label>
                    </div>
                    <div className="flex items-end">
                      <button type="button" onClick={() => removeMaterial(index)} className="text-danger hover:opacity-70">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                          <path d="M4 7h16M9 7V4h6v3m-9 0 1 14h10l1-14M10 11v6m4-6v6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumen */}
          <div className="grid gap-3 rounded-sm bg-cream p-4 text-sm sm:grid-cols-2 lg:grid-cols-5">
            <p>
              <span className="block text-xs text-ink/55">Costo total</span>
              <strong>{money(total)}</strong>
            </p>
            <p>
              <span className="block text-xs text-ink/55">
                {tipoCosto === 'producto' ? 'Cantidad producida' : 'Cupos'}
              </span>
              <strong>{quantityProduced || 0}</strong>
            </p>
            <p>
              <span className="block text-xs text-ink/55">Costo unitario</span>
              <strong>{money(unitCost)}</strong>
            </p>
            <p>
              <span className="block text-xs text-ink/55">
                {tipoCosto === 'producto' ? 'Precio del producto' : 'Precio del taller'}
              </span>
              <strong>{money(itemPrice)}</strong>
            </p>
            <p>
              <span className="block text-xs text-ink/55">Margen unitario</span>
              <strong>{money(margin)} · {marginPercentage.toFixed(1)}%</strong>
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <button type="button" onClick={() => setOpen(false)} className="px-5 py-2.5 text-sm text-ink/60">Cancelar</button>
            <button type="submit" className="rounded-sm bg-gold px-6 py-2.5 text-sm text-ink">Guardar costo</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}