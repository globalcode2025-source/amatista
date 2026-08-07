import { useOutletContext } from 'react-router-dom';
import type { AdminContextType } from '../AdminLayout';
import { CrudPage } from '../components/CrudPage';
import type { ColumnConfig } from '../components/DataTable';
import type { FieldConfig } from '../components/FormField';
import type { ProductoAdmin } from '../types';

const money = (n: number) => `$${n.toLocaleString('es-CO')}`;

export default function ProductosPage() {
  const { productos } = useOutletContext<AdminContextType>();

  const columns: ColumnConfig<ProductoAdmin>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'imagen', label: 'Imagen', render: (row) => <span className="max-w-[220px] truncate block">{row.imagen}</span> },
    { key: 'precio', label: 'Precio', render: (row) => money(row.precio) },
    { key: 'stock', label: 'Stock' },
    { key: 'descripcion', label: 'Descripción' },
  ];

  const fields: FieldConfig[] = [
    { key: 'nombre', label: 'Nombre del producto', type: 'text', required: true },
    { key: 'categoria', label: 'Categoría', type: 'text', required: true },
    { key: 'imagen', label: 'Imagen (URL)', type: 'text', required: true, placeholder: 'https://...' },
    { key: 'precio', label: 'Precio (COP)', type: 'number', required: true },
    { key: 'stock', label: 'Stock', type: 'number', required: true },
    { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
  ];

  return (
    <CrudPage<ProductoAdmin>
      title="Productos"
      singular="Producto"
      items={productos.items}
      columns={columns}
      fields={fields}
      searchKeys={['nombre', 'categoria', 'descripcion']}
      emptyItem={{ nombre: '', categoria: '', imagen: '', precio: 0, stock: 0, descripcion: '' }}
      onAdd={productos.add}
      onUpdate={productos.update}
      onDelete={productos.remove}
    />
  );
}