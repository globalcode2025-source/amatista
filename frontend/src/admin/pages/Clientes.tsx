import { useOutletContext } from 'react-router-dom';
import type { AdminContextType } from '../AdminLayout';
import { CrudPage } from '../components/CrudPage';
import type { ColumnConfig } from '../components/DataTable';
import type { FieldConfig } from '../components/FormField';
import type { Cliente } from '../types';

export default function ClientesPage() {
  const { clientes } = useOutletContext<AdminContextType>();

  const columns: ColumnConfig<Cliente>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    { key: 'ciudad', label: 'Ciudad' },
    { key: 'direccion', label: 'Dirección' },
  ];

  const fields: FieldConfig[] = [
    { key: 'nombre', label: 'Nombre completo', type: 'text', required: true },
    { key: 'telefono', label: 'Teléfono', type: 'tel', required: true },
    { key: 'email', label: 'Correo electrónico', type: 'email', required: true },
    { key: 'ciudad', label: 'Ciudad', type: 'text', required: true },
    { key: 'direccion', label: 'Dirección', type: 'text' },
    { key: 'notas', label: 'Notas', type: 'textarea' },
  ];

  return (
    <CrudPage<Cliente>
      title="Clientes"
      singular="Cliente"
      items={clientes.items}
      columns={columns}
      fields={fields}
      searchKeys={['nombre', 'email', 'ciudad', 'telefono']}
      emptyItem={{ nombre: '', telefono: '', email: '', ciudad: '', direccion: '', notas: '' }}
      onAdd={clientes.add}
      onUpdate={clientes.update}
      onDelete={clientes.remove}
    />
  );
}