import { useOutletContext } from 'react-router-dom';
import type { AdminContextType } from '../AdminLayout';
import { CrudPage } from '../components/CrudPage';
import type { ColumnConfig } from '../components/DataTable';
import type { FieldConfig } from '../components/FormField';
import type { Gasto } from '../types';

const money = (n: number) => `$${n.toLocaleString('es-CO')}`;

export default function GastosPage() {
  const { gastos } = useOutletContext<AdminContextType>();

  const columns: ColumnConfig<Gasto>[] = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'concepto', label: 'Concepto' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'proveedor', label: 'Proveedor' },
    { key: 'monto', label: 'Monto', render: (row) => money(row.monto) },
  ];

  const fields: FieldConfig[] = [
    { key: 'fecha', label: 'Fecha', type: 'date', required: true },
    { key: 'concepto', label: 'Concepto', type: 'text', required: true },
    { key: 'categoria', label: 'Categoría', type: 'text', required: true },
    { key: 'proveedor', label: 'Proveedor', type: 'text' },
    { key: 'monto', label: 'Monto (COP)', type: 'number', required: true },
  ];

  return (
    <CrudPage<Gasto>
      title="Gastos"
      singular="Gasto"
      items={gastos.items}
      columns={columns}
      fields={fields}
      searchKeys={['concepto', 'categoria', 'proveedor', 'fecha']}
      emptyItem={{ fecha: '', concepto: '', categoria: '', proveedor: '', monto: 0 }}
      onAdd={gastos.add}
      onUpdate={gastos.update}
      onDelete={gastos.remove}
    />
  );
}