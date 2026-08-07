import { useOutletContext } from 'react-router-dom';
import type { AdminContextType } from '../AdminLayout';
import { CrudPage } from '../components/CrudPage';
import type { ColumnConfig } from '../components/DataTable';
import type { FieldConfig } from '../components/FormField';
import type { GaleriaAdmin, TipoContenido } from '../types';

const TIPOS: TipoContenido[] = ['Imagen', 'Video'];

export default function GaleriaPage() {
  const { galeria } = useOutletContext<AdminContextType>();

  const columns: ColumnConfig<GaleriaAdmin>[] = [
    { key: 'titulo', label: 'Título' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'media', label: 'Archivo', render: (row) => <span className="max-w-[240px] truncate block">{row.media}</span> },
    { key: 'descripcion', label: 'Descripción' },
  ];

  const fields: FieldConfig[] = [
    { key: 'titulo', label: 'Título', type: 'text', required: true },
    { key: 'tipo', label: 'Tipo de contenido', type: 'select', required: true, options: TIPOS.map((tipo) => ({ value: tipo, label: tipo })) },
    { key: 'media', label: 'Imagen o video (URL)', type: 'text', required: true, placeholder: 'https://...' },
    { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
  ];

  return (
    <CrudPage<GaleriaAdmin>
      title="Galería"
      singular="Elemento"
      items={galeria.items}
      columns={columns}
      fields={fields}
      searchKeys={['titulo', 'descripcion', 'tipo']}
      emptyItem={{ titulo: '', tipo: 'Imagen', media: '', descripcion: '' }}
      onAdd={galeria.add}
      onUpdate={galeria.update}
      onDelete={galeria.remove}
      maxItems={7}
    />
  );
}