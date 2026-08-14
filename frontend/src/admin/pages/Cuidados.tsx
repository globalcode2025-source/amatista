import { useEffect, useState, type FormEvent } from 'react';
import { DataTable, type ColumnConfig } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { FormField, type FieldConfig } from '../components/FormField';
import type { Cuidado } from '../types';
import { createCuidado, deleteCuidado, fetchCuidados, updateCuidado } from '../../services/cuidados';

type CuidadoForm = Omit<Cuidado, 'id'>;
const EMPTY_FORM: CuidadoForm = { pregunta: '', respuesta: '', orden: 0 };

export default function CuidadosPage() {
  const [items, setItems] = useState<Cuidado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Cuidado | null>(null);
  const [form, setForm] = useState<CuidadoForm>(EMPTY_FORM);
  const [success, setSuccess] = useState('');

  const fields: FieldConfig[] = [
    { 
      key: 'pregunta', 
      label: 'Pregunta', 
      type: 'textarea', 
      required: true,
      className: 'min-h-[80px]'
    },
    { 
      key: 'respuesta', 
      label: 'Respuesta', 
      type: 'textarea', 
      required: true,
      className: 'min-h-[120px]'
    },
    { 
      key: 'orden', 
      label: 'Orden de visualización', 
      type: 'number', 
      required: true 
    },
  ];

  const columns: ColumnConfig<Cuidado>[] = [
    { 
      key: 'pregunta', 
      label: 'Pregunta',
      render: (row) => (
        <div className="max-w-md">
          <p className="font-medium text-ink">{row.pregunta}</p>
          <p className="mt-1 text-sm text-ink/60 line-clamp-2">{row.respuesta}</p>
        </div>
      )
    },
    { 
      key: 'orden', 
      label: 'Orden',
      className: 'text-center'
    },
  ];

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      setItems(await fetchCuidados());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los cuidados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = items.filter((item) => 
    [item.pregunta, item.respuesta].some((value) => 
      value.toLowerCase().includes(query.toLowerCase())
    )
  );

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (item: Cuidado) => {
    setEditing(item);
    setForm({ 
      pregunta: item.pregunta, 
      respuesta: item.respuesta, 
      orden: item.orden 
    });
    setModalOpen(true);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const wasEditing = Boolean(editing);
      if (editing) {
        await updateCuidado(editing.id, form);
      } else {
        await createCuidado(form);
      }
      setModalOpen(false);
      await load();
      setSuccess(`Cuidado ${wasEditing ? 'actualizado' : 'guardado'} correctamente.`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'No se pudo guardar el cuidado');
    }
  };

  const remove = async (item: Cuidado) => {
    try {
      await deleteCuidado(item.id);
      await load();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'No se pudo eliminar el cuidado');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Cuidados</h1>
          <p className="text-sm text-ink/55">{items.length} en total</p>
        </div>
        <div className="flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar cuidados..."
            className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
          />
          <button
            type="button"
            onClick={openNew}
            className="rounded-sm bg-amatista-deep px-5 py-2.5 text-sm text-cream hover:bg-amatista-mid"
          >
            + Nuevo cuidado
          </button>
        </div>
      </div>

      {loading && (
        <p className="rounded-sm border border-ink/10 bg-white px-4 py-3 text-sm text-ink/55">
          Cargando cuidados...
        </p>
      )}
      {!loading && error && (
        <p className="rounded-sm border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="mb-4 rounded-sm border border-success/25 bg-success/10 px-4 py-3 text-sm text-success">
          {success}
        </p>
      )}
      {!loading && !error && (
        <DataTable 
          columns={columns} 
          rows={filtered} 
          onEdit={openEdit} 
          onDelete={remove}
          emptyLabel="Aún no hay cuidados registrados."
        />
      )}

      <Modal 
        open={modalOpen} 
        title={editing ? 'Editar cuidado' : 'Nuevo cuidado'} 
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={submit} className="flex flex-col gap-4">
          {fields.map((field) => (
            <FormField
              key={field.key}
              field={field}
              value={(form as Record<string, unknown>)[field.key]}
              onChange={(key, value) => setForm((old) => ({ ...old, [key]: value }))}
            />
          ))}
          <div className="mt-2 flex justify-center gap-3">
            <button 
              type="button" 
              onClick={() => setModalOpen(false)} 
              className="px-5 py-2.5 text-sm text-ink/60 hover:text-ink"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="rounded-sm bg-gold px-6 py-2.5 text-sm text-ink hover:bg-gold-light"
            >
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}