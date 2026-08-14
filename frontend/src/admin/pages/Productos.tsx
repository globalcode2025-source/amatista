import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { DataTable, type ColumnConfig } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { FormField, type FieldConfig } from '../components/FormField';
import type { ProductoAdmin, Categoria } from '../types';
import { createProducto, deleteProducto, fetchProductos, resolveProductoImage, updateProducto } from '../../services/productos';
import { fetchCategorias, createCategoria, deleteCategoria } from '../../services/categorias';

const money = (n: number) => `$${n.toLocaleString('es-CO')}`;
type Form = Omit<ProductoAdmin, 'id' | 'imagen'> & { imagenFile: File | null; preview: string };
const empty: Form = { nombre: '', categoria: '', precio: '' as any, stock: 0, descripcion: '', imagenFile: null, preview: '' };

export default function ProductosPage() {
  const [items, setItems] = useState<ProductoAdmin[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState<Form>(empty);
  const [edit, setEdit] = useState<ProductoAdmin | null>(null);
  const [open, setOpen] = useState(false);
  const [categoriasOpen, setCategoriasOpen] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas');

  const load = async () => { 
    try { 
      const [loadedProductos, loadedCategorias] = await Promise.all([fetchProductos(), fetchCategorias()]);
      setItems(loadedProductos); 
      setCategorias(loadedCategorias);
    } catch (e) { 
      setError(e instanceof Error ? e.message : 'Error'); 
    } 
  };
  useEffect(() => { void load(); }, []);
  const categories = useMemo(() => ['Todas', ...Array.from(new Set(items.map((item) => item.categoria).filter(Boolean)))], [items]);
  const filtered = useMemo(() => items.filter((item) => (category === 'Todas' || item.categoria === category) && [item.nombre, item.descripcion, item.categoria].some((value) => value.toLowerCase().includes(query.toLowerCase()))), [items, category, query]);
  const categoriaOptions = useMemo(() => {
    if (categorias.length === 0) {
      return [{ value: '', label: 'No hay categorías - crea una primero' }];
    }
    return categorias.map((cat) => ({ value: cat.nombre, label: cat.nombre }));
  }, [categorias]);
  const fields: FieldConfig[] = [{ key: 'nombre', label: 'Nombre', type: 'text', required: true }, { key: 'categoria', label: 'Categoría', type: 'select', required: true, options: categoriaOptions }, { key: 'precio', label: 'Precio (COP)', type: 'number', required: true }, { key: 'stock', label: 'Stock', type: 'number', required: true }, { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true }];
  const columns: ColumnConfig<ProductoAdmin>[] = [{ key: 'imagen', label: 'Imagen', render: (row) => <img src={resolveProductoImage(row.imagen)} className="h-12 w-16 rounded-sm object-cover" /> }, { key: 'nombre', label: 'Nombre' }, { key: 'categoria', label: 'Categoría' }, { key: 'precio', label: 'Precio', render: (row) => money(row.precio) }, { key: 'stock', label: 'Stock', render: (row) => <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${row.stock === 0 ? 'bg-danger/10 text-danger' : 'bg-success/15 text-success'}`}>{row.stock}</span> }];

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const wasEditing = Boolean(edit);
      if (!edit && !form.imagenFile) return window.alert('Selecciona una imagen.');
      const { preview, ...input } = form;
      if (edit) await updateProducto(edit.id, input); else await createProducto({ ...input, imagenFile: form.imagenFile! });
      setOpen(false); await load(); setSuccess(`Producto ${wasEditing ? 'actualizado' : 'guardado'} correctamente.`);
    } catch (err) { window.alert(err instanceof Error ? err.message : 'No se pudo guardar el producto.'); }
  };

  const remove = async (item: ProductoAdmin) => { try { await deleteProducto(item.id); await load(); } catch (err) { window.alert(err instanceof Error ? err.message : 'No se pudo eliminar el producto.'); } };

  const handleAddCategoria = async () => {
    if (!nuevaCategoria.trim()) return window.alert('Ingresa un nombre para la categoría');
    try {
      await createCategoria({ nombre: nuevaCategoria.trim() });
      setNuevaCategoria('');
      await load();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'No se pudo crear la categoría');
    }
  };

  const handleDeleteCategoria = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
    try {
      await deleteCategoria(id);
      await load();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'No se pudo eliminar la categoría');
    }
  };

  return <div>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 className="font-serif text-2xl font-semibold text-ink">Productos</h1><p className="text-sm text-ink/55">{items.length} en total</p></div><div className="flex flex-wrap gap-3"><Link to="/admin/costos" className="rounded-sm border border-amatista-deep px-5 py-2.5 text-sm text-amatista-deep hover:bg-amatista-deep hover:text-cream">+ Agregar costo</Link><button type="button" onClick={() => setCategoriasOpen(true)} className="rounded-sm border border-amatista-deep px-5 py-2.5 text-sm text-amatista-deep hover:bg-amatista-deep hover:text-cream">Categoría</button><button type="button" onClick={() => { setEdit(null); setForm(empty); setOpen(true); }} className="rounded-sm bg-amatista-deep px-5 py-2.5 text-sm text-cream">+ Nuevo producto</button></div></div>
    <div className="mb-5 flex flex-wrap items-center gap-3"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar productos..." className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold focus:outline-none" /><div className="flex flex-wrap gap-2">{categories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`rounded-full border px-4 py-2 text-xs transition-colors ${category === item ? 'border-amatista-deep bg-amatista-deep text-cream' : 'border-ink/15 text-ink/60 hover:border-gold'}`}>{item}</button>)}</div></div>
    {error && <p className="text-danger">{error}</p>}
    {success && <p role="status" className="mb-4 rounded-sm border border-success/25 bg-success/10 px-4 py-3 text-sm text-success">{success}</p>}
    <DataTable columns={columns} rows={filtered} onEdit={(item) => { setEdit(item); setForm({ ...item, imagenFile: null, preview: resolveProductoImage(item.imagen) }); setOpen(true); }} onDelete={remove} />
    <Modal open={open} title={edit ? 'Actualizar producto' : 'Agregar producto'} onClose={() => setOpen(false)}><form onSubmit={submit} className="flex flex-col gap-4">{fields.map((field) => <FormField key={field.key} field={field} value={(form as any)[field.key]} onChange={(key, value) => setForm((old) => ({ ...old, [key]: value }))} />)}<label><span className="mb-1.5 block text-xs uppercase text-ink/55">Imagen</span><input required={!edit} type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0] ?? null; setForm((old) => ({ ...old, imagenFile: file, preview: file ? URL.createObjectURL(file) : old.preview })); }} /></label>{form.preview && <img src={form.preview} className="h-56 w-full object-cover" />}<div className="mt-2 flex justify-center gap-3"><button type="button" onClick={() => setOpen(false)} className="px-5 py-2.5 text-sm text-ink/60">Cancelar</button><button type="submit" className="rounded-sm bg-gold px-6 py-2.5 text-sm text-ink">Guardar</button></div></form></Modal>
    
    <Modal open={categoriasOpen} title="Gestionar categorías" onClose={() => setCategoriasOpen(false)}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <input 
            value={nuevaCategoria} 
            onChange={(e) => setNuevaCategoria(e.target.value)} 
            placeholder="Nueva categoría" 
            className="flex-1 rounded-sm border border-ink/15 px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
          <button 
            type="button" 
            onClick={handleAddCategoria}
            className="rounded-sm bg-amatista-deep px-4 py-2 text-sm text-cream hover:bg-amatista-mid"
          >
            Agregar
          </button>
        </div>
        
        <div className="rounded-sm border border-ink/10 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-cream">
                <th className="px-4 py-2 text-left font-medium text-ink">Categoría</th>
                <th className="px-4 py-2 text-right font-medium text-ink">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-center text-ink/55">
                    No hay categorías registradas
                  </td>
                </tr>
              )}
              {categorias.map((categoria) => (
                <tr key={categoria.id} className="border-b border-ink/10 last:border-0">
                  <td className="px-4 py-2">{categoria.nombre}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteCategoria(categoria.id)}
                      className="text-danger hover:opacity-70"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  </div>;
}
