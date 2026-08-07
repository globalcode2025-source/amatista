import { useOutletContext } from 'react-router-dom';
import type { AdminContextType } from '../AdminLayout';
import { CrudPage } from '../components/CrudPage';
import type { ColumnConfig } from '../components/DataTable';
import type { FieldConfig } from '../components/FormField';
import type { Ingreso } from '../types';

const money = (n: number) => `$${n.toLocaleString('es-CO')}`;

export default function IngresosPage() {
  const { ingresos } = useOutletContext<AdminContextType>();

  const columns: ColumnConfig<Ingreso>[] = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'concepto', label: 'Concepto' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'monto', label: 'Monto', render: (row) => money(row.monto) },
    { key: 'metodoPago', label: 'Método de pago' },
  ];

  const fields: FieldConfig[] = [
    { key: 'fecha', label: 'Fecha', type: 'date', required: true },
    { key: 'concepto', label: 'Concepto', type: 'text', required: true },
    { key: 'categoria', label: 'Categoría', type: 'text', required: true },
    { key: 'monto', label: 'Monto (COP)', type: 'number', required: true },
    { key: 'metodoPago', label: 'Método de pago', type: 'text', required: true },
  ];

  return (
    <CrudPage<Ingreso>
      title="Ingresos"
      singular="Ingreso"
      items={ingresos.items}
      columns={columns}
      fields={fields}
      searchKeys={['concepto', 'categoria', 'metodoPago', 'fecha']}
      emptyItem={{ fecha: '', concepto: '', categoria: '', monto: 0, metodoPago: '' }}
      onAdd={ingresos.add}
      onUpdate={ingresos.update}
      onDelete={ingresos.remove}
    />
  );
}