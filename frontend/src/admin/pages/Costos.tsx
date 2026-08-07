import { useOutletContext } from 'react-router-dom';
import type { AdminContextType } from '../AdminLayout';
import { CrudPage } from '../components/CrudPage';
import type { ColumnConfig } from '../components/DataTable';
import type { FieldConfig } from '../components/FormField';
import type { Costo } from '../types';

const money = (n: number) => `$${n.toLocaleString('es-CO')}`;

export default function CostosPage() {
  const { costos } = useOutletContext<AdminContextType>();

  const columns: ColumnConfig<Costo>[] = [
    { key: 'insumo', label: 'Insumo' },
    { key: 'productoRelacionado', label: 'Producto relacionado' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'costoUnitario', label: 'Costo unitario', render: (row) => money(row.costoUnitario) },
    { key: 'costoTotal', label: 'Costo total', render: (row) => money(row.costoTotal) },
  ];

  const fields: FieldConfig[] = [
    { key: 'insumo', label: 'Insumo', type: 'text', required: true },
    { key: 'productoRelacionado', label: 'Producto relacionado', type: 'text', required: true },
    { key: 'cantidad', label: 'Cantidad', type: 'text', required: true },
    { key: 'costoUnitario', label: 'Costo unitario (COP)', type: 'number', required: true },
    { key: 'costoTotal', label: 'Costo total (COP)', type: 'number', required: true },
  ];

  return (
    <CrudPage<Costo>
      title="Costos"
      singular="Costo"
      items={costos.items}
      columns={columns}
      fields={fields}
      searchKeys={['insumo', 'productoRelacionado', 'cantidad']}
      emptyItem={{ insumo: '', productoRelacionado: '', cantidad: '', costoUnitario: 0, costoTotal: 0 }}
      onAdd={costos.add}
      onUpdate={costos.update}
      onDelete={costos.remove}
    />
  );
}