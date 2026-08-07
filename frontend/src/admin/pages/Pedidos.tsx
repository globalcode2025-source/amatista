import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { AdminContextType } from '../AdminLayout';
import { CrudPage } from '../components/CrudPage';
import { StatusBadge } from '../components/StatusBadge';
import type { ColumnConfig } from '../components/DataTable';
import type { FieldConfig } from '../components/FormField';
import type { EstadoPedido, Pedido } from '../types';

const ESTADOS: EstadoPedido[] = ['Pendiente', 'En proceso', 'Despachado', 'Entregado'];
const FORMAS_PAGO = ['Transferencia', 'Nequi', 'Daviplata', 'Efectivo', 'Tarjeta'] as const;
const TABS = ['Todos', ...ESTADOS] as const;

const money = (n: number) => `$${n.toLocaleString('es-CO')}`;

export default function PedidosPage() {
  const { pedidos, clientes } = useOutletContext<AdminContextType>();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Todos');

  const clienteOptions = clientes.items.map((c) => ({ value: c.id, label: c.nombre }));
  const nombreCliente = (id: string) => clientes.items.find((c) => c.id === id)?.nombre ?? 'Cliente eliminado';

  const preFiltered = useMemo(
    () => (tab === 'Todos' ? pedidos.items : pedidos.items.filter((p) => p.estado === tab)),
    [pedidos.items, tab],
  );

  const columns: ColumnConfig<Pedido>[] = [
    { key: 'clienteId', label: 'Cliente', render: (row) => nombreCliente(row.clienteId) },
    { key: 'codigo', label: 'Código' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'formaPago', label: 'Forma de pago' },
    { key: 'direccionEnvio', label: 'Dirección de envío' },
    { key: 'estado', label: 'Estado', render: (row) => <StatusBadge estado={row.estado} /> },
    { key: 'total', label: 'Total', render: (row) => money(row.total) },
  ];

  const fields: FieldConfig[] = [
    { key: 'clienteId', label: 'Cliente', type: 'select', required: true, options: clienteOptions },
    { key: 'codigo', label: 'Código del pedido', type: 'text', required: true, placeholder: 'AMT-2026-001' },
    { key: 'cantidad', label: 'Cantidad', type: 'number', required: true },
    { key: 'descripcion', label: 'Descripción del pedido', type: 'textarea', required: true },
    { key: 'fecha', label: 'Fecha', type: 'date', required: true },
    { key: 'formaPago', label: 'Forma de pago', type: 'select', required: true, options: FORMAS_PAGO.map((e) => ({ value: e, label: e })) },
    { key: 'direccionEnvio', label: 'Dirección de envío', type: 'textarea', required: true },
    { key: 'estado', label: 'Estado', type: 'select', required: true, options: ESTADOS.map((e) => ({ value: e, label: e })) },
    { key: 'total', label: 'Total (COP)', type: 'number', required: true },
    { key: 'notas', label: 'Notas (opcional)', type: 'textarea' },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-wide transition-colors ${
              tab === t ? 'border-amatista-deep bg-amatista-deep text-cream' : 'border-ink/15 text-ink/60 hover:border-amatista-deep'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <CrudPage<Pedido>
        title="Pedidos"
        singular="Pedido"
        items={preFiltered}
        columns={columns}
        fields={fields}
        searchKeys={['descripcion', 'fecha']}
        emptyItem={{
          clienteId: clientes.items[0]?.id ?? '',
          codigo: '',
          cantidad: 1,
          descripcion: '',
          fecha: '',
          formaPago: 'Transferencia',
          direccionEnvio: '',
          estado: 'Pendiente',
          total: 0,
          notas: '',
        }}
        onAdd={pedidos.add}
        onUpdate={pedidos.update}
        onDelete={pedidos.remove}
      />
    </div>
  );
}