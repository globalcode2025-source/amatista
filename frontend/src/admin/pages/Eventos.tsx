import { useOutletContext } from 'react-router-dom';
import type { AdminContextType } from '../AdminLayout';
import { CrudPage } from '../components/CrudPage';
import type { ColumnConfig } from '../components/DataTable';
import type { FieldConfig } from '../components/FormField';
import type { EstadoEvento, EventoAdmin } from '../types';

const ESTADOS: EstadoEvento[] = ['Próximo', 'Realizado', 'Cancelado'];
const money = (n: number) => `$${n.toLocaleString('es-CO')}`;

export default function EventosPage() {
  const { eventos } = useOutletContext<AdminContextType>();

  const columns: ColumnConfig<EventoAdmin>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'media', label: 'Imagen o video', render: (row) => <span className="max-w-[220px] truncate block">{row.media}</span> },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'hora', label: 'Hora' },
    { key: 'ubicacion', label: 'Ubicación' },
    { key: 'duracion', label: 'Duración' },
    { key: 'frase', label: 'Frase' },
    { key: 'queTrae', label: 'Qué trae' },
    { key: 'estado', label: 'Estado' },
    { key: 'precio', label: 'Precio', render: (row) => money(row.precio) },
  ];

  const fields: FieldConfig[] = [
    { key: 'nombre', label: 'Nombre del evento', type: 'text', required: true },
    { key: 'media', label: 'Imagen o video (URL)', type: 'text', required: true, placeholder: 'https://...' },
    { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
    { key: 'fecha', label: 'Fecha', type: 'date', required: true },
    { key: 'hora', label: 'Hora', type: 'text', required: true, placeholder: '18:00' },
    { key: 'ubicacion', label: 'Ubicación', type: 'text', required: true },
    { key: 'duracion', label: 'Duración (minutos)', type: 'number', required: true },
    { key: 'frase', label: 'Frase', type: 'text', required: true },
    { key: 'queTrae', label: 'Qué trae', type: 'textarea', required: true },
    { key: 'cupos', label: 'Cupos', type: 'number', required: true },
    { key: 'cuposDisponibles', label: 'Cupos disponibles', type: 'number', required: true },
    { key: 'precio', label: 'Precio (COP)', type: 'number', required: true },
    { key: 'estado', label: 'Estado', type: 'select', required: true, options: ESTADOS.map((e) => ({ value: e, label: e })) },
  ];

  return (
    <CrudPage<EventoAdmin>
      title="Eventos"
      singular="Evento"
      items={eventos.items}
      columns={columns}
      fields={fields}
      searchKeys={['nombre', 'ubicacion', 'fecha']}
      emptyItem={{
        nombre: '',
        media: '',
        descripcion: '',
        fecha: '',
        hora: '',
        ubicacion: '',
        duracion: 0,
        frase: '',
        queTrae: '',
        cupos: 0,
        cuposDisponibles: 0,
        precio: 0,
        estado: 'Próximo',
      }}
      onAdd={eventos.add}
      onUpdate={eventos.update}
      onDelete={eventos.remove}
    />
  );
}