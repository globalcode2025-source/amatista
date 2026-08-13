import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { DataTable, type ColumnConfig } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { FormField, type FieldConfig } from '../components/FormField';
import type { GaleriaAdmin, TipoContenido } from '../types';
import { createGaleria, deleteGaleria, fetchGaleria, updateGaleria, resolveMediaUrl } from '../../services/galeria';

const TIPOS: TipoContenido[] = ['Imagen', 'Video'];

type GaleriaFormState = {
  titulo: string;
  tipo: TipoContenido;
  descripcion: string;
  mediaFile: File | null;
  mediaPreview: string;
};

const EMPTY_FORM: GaleriaFormState = {
  titulo: '',
  tipo: 'Imagen',
  descripcion: '',
  mediaFile: null,
  mediaPreview: '',
};

export default function GaleriaPage() {
  const [items, setItems] = useState<GaleriaAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<GaleriaAdmin | null>(null);
  const [form, setForm] = useState<GaleriaFormState>(EMPTY_FORM);
  const [success, setSuccess] = useState('');

  const loadGaleria = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchGaleria();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar la galería');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadGaleria();
  }, []);

  const maxItemsReached = items.length >= 7 && !editing;

  const columns: ColumnConfig<GaleriaAdmin>[] = [
    { key: 'titulo', label: 'Título' },
    { key: 'tipo', label: 'Tipo' },
    {
      key: 'media',
      label: 'Archivo',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.tipo === 'Imagen' ? (
            <img src={resolveMediaUrl(row.media)} alt={row.titulo} className="h-12 w-16 rounded-sm object-cover" />
          ) : (
            <video src={resolveMediaUrl(row.media)} className="h-12 w-16 rounded-sm object-cover" muted playsInline />
          )}
          <span className="max-w-[240px] truncate block text-ink/65">{row.media}</span>
        </div>
      ),
    },
    { key: 'descripcion', label: 'Descripción' },
  ];

  const fields: FieldConfig[] = [
    { key: 'titulo', label: 'Título', type: 'text', required: true },
    { key: 'tipo', label: 'Tipo de contenido', type: 'select', required: true, options: TIPOS.map((tipo) => ({ value: tipo, label: tipo })) },
    { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
  ];

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (row: GaleriaAdmin) => {
    setEditing(row);
    setForm({
      titulo: row.titulo,
      tipo: row.tipo,
      descripcion: row.descripcion,
      mediaFile: null,
      mediaPreview: resolveMediaUrl(row.media),
    });
    setModalOpen(true);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setForm((prev) => ({ ...prev, mediaFile: null, mediaPreview: editing ? resolveMediaUrl(editing.media) : '' }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      mediaFile: file,
      mediaPreview: URL.createObjectURL(file),
    }));
  };

  useEffect(() => {
    return () => {
      if (form.mediaPreview.startsWith('blob:')) {
        URL.revokeObjectURL(form.mediaPreview);
      }
    };
  }, [form.mediaPreview]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const wasEditing = Boolean(editing);
      if (editing) {
        await updateGaleria(editing.id, {
          titulo: form.titulo,
          tipo: form.tipo,
          descripcion: form.descripcion,
          mediaFile: form.mediaFile ?? undefined,
        });
      } else {
        if (!form.mediaFile) {
          window.alert('Debes seleccionar una imagen o video desde tu dispositivo.');
          return;
        }
        await createGaleria({
          titulo: form.titulo,
          tipo: form.tipo,
          descripcion: form.descripcion,
          mediaFile: form.mediaFile,
        });
      }
      setModalOpen(false);
      setEditing(null);
      setForm(EMPTY_FORM);
      await loadGaleria();
      setSuccess(`Elemento ${wasEditing ? 'actualizado' : 'guardado'} correctamente.`);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'No se pudo guardar la galería');
    }
  };

  const handleDelete = async (row: GaleriaAdmin) => {
    try {
      await deleteGaleria(row.id);
      await loadGaleria();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'No se pudo eliminar el elemento');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Galería</h1>
          <p className="text-sm text-ink/55">{items.length} en total</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={openNew}
            disabled={maxItemsReached}
            className="whitespace-nowrap rounded-sm bg-amatista-deep px-5 py-2.5 text-sm text-cream transition-colors hover:bg-amatista-mid disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Nuevo elemento
          </button>
        </div>
      </div>

      <p className="mb-4 text-sm text-ink/55">Sube una imagen o video desde tu celular o computador. No se usa URL.</p>

      {loading && <p className="rounded-sm border border-ink/10 bg-white px-4 py-3 text-sm text-ink/55">Cargando galería...</p>}
      {!loading && error && <p className="rounded-sm border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">{error}</p>}
      {success && <p role="status" className="mb-4 rounded-sm border border-success/25 bg-success/10 px-4 py-3 text-sm text-success">{success}</p>}

      {!loading && !error && <DataTable columns={columns} rows={items} onEdit={openEdit} onDelete={handleDelete} />}

      <Modal open={modalOpen} title={editing ? 'Editar elemento' : 'Nuevo elemento'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map((field) => (
            <FormField
              key={field.key}
              field={field}
              value={(form as any)[field.key]}
              onChange={(key, value) => setForm((prev) => ({ ...prev, [key]: value }))}
            />
          ))}

          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">Archivo de imagen o video</span>
            <input
              type="file"
              accept={form.tipo === 'Video' ? 'video/*' : 'image/*'}
              className="w-full rounded-sm border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
              onChange={handleFileChange}
            />
          </label>

          {form.mediaPreview && (
            <div className="overflow-hidden rounded-sm border border-ink/10 bg-cream/50">
              {form.tipo === 'Video' ? (
                <video src={form.mediaPreview} className="h-56 w-full object-cover" controls playsInline />
              ) : (
                <img src={form.mediaPreview} alt="Vista previa" className="h-56 w-full object-cover" />
              )}
            </div>
          )}

          <div className="mt-2 flex justify-center gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-ink/60 hover:text-ink">
              Cancelar
            </button>
            <button type="submit" className="rounded-sm bg-gold px-6 py-2.5 text-sm text-ink hover:bg-gold-light">
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
