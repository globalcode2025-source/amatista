import { useOutletContext } from 'react-router-dom';
import type { AdminContextType } from '../AdminLayout';
import { CrudPage } from '../components/CrudPage';
import type { ColumnConfig } from '../components/DataTable';
import type { FieldConfig } from '../components/FormField';
import type { EstadoTestimonio, TestimonioAdmin } from '../types';

const ESTADOS: EstadoTestimonio[] = ['Pendiente', 'Aceptado', 'Rechazado'];

export default function TestimoniosPage() {
  const { testimonios } = useOutletContext<AdminContextType>();

  const columns: ColumnConfig<TestimonioAdmin>[] = [
    { key: 'nombre', label: 'Nombre del testimonio' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'estado', label: 'Estado' },
  ];

  const fields: FieldConfig[] = [
    { key: 'nombre', label: 'Nombre del testimonio', type: 'text', required: true },
    { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
    { key: 'tipo', label: 'Tipo', type: 'text', required: true, placeholder: 'Cliente, taller, producto...' },
    { key: 'estado', label: 'Estado', type: 'select', required: true, options: ESTADOS.map((estado) => ({ value: estado, label: estado })) },
  ];

  return (
    <CrudPage<TestimonioAdmin>
      title="Testimonios"
      singular="Testimonio"
      items={testimonios.items}
      columns={columns}
      fields={fields}
      searchKeys={['nombre', 'descripcion', 'tipo', 'estado']}
      emptyItem={{ nombre: '', descripcion: '', tipo: '', estado: 'Pendiente' }}
      onAdd={testimonios.add}
      onUpdate={testimonios.update}
      onDelete={testimonios.remove}
    />
  );
}