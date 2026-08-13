import { useMemo, useState, type FormEvent } from 'react';
import { DataTable, type ColumnConfig } from './DataTable';
import { Modal } from './Modal';
import { FormField, type FieldConfig } from './FormField';

interface CrudPageProps<T extends { id: string }> {
  title: string;
  singular: string;
  items: T[];
  columns: ColumnConfig[];
  fields: FieldConfig[];
  searchKeys: string[];
  emptyItem: Omit<T, 'id'>;
  onAdd: (item: Omit<T, 'id'>) => void;
  onUpdate: (id: string, patch: Partial<T>) => void;
  onDelete: (id: string) => void;
  hideSearch?: boolean;
}

export function CrudPage<T extends { id: string }>({
  title,
  singular,
  items,
  columns,
  fields,
  searchKeys,
  emptyItem,
  onAdd,
  onUpdate,
  onDelete,
  hideSearch,
}: CrudPageProps<T>) {
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => searchKeys.some((k) => String((item as any)[k] ?? '').toLowerCase().includes(q)));
  }, [items, query, searchKeys]);

  const openNew = () => {
    setEditing(null);
    setFormData({ ...emptyItem });
    setModalOpen(true);
  };

  const openEdit = (row: T) => {
    setEditing(row);
    setFormData({ ...row });
    setModalOpen(true);
  };

  const handleDelete = (row: T) => onDelete(row.id);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) onUpdate(editing.id, formData as Partial<T>);
    else onAdd(formData as Omit<T, 'id'>);
    setModalOpen(false);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">{title}</h1>
          <p className="text-sm text-ink/55">{items.length} en total</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {!hideSearch && (
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Buscar en ${title.toLowerCase()}...`}
              className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
            />
          )}
          <button
            type="button"
            onClick={openNew}
            className="whitespace-nowrap rounded-sm bg-amatista-deep px-5 py-2.5 text-sm text-cream transition-colors hover:bg-amatista-mid"
          >
            + Nuevo{singular.endsWith('a') ? 'a' : ''} {singular}
          </button>
        </div>
      </div>

      <DataTable columns={columns} rows={filtered} onEdit={openEdit} onDelete={handleDelete} />

      <Modal open={modalOpen} title={editing ? `Editar ${singular}` : `Nuevo ${singular}`} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map((f) => (
            <FormField
              key={f.key}
              field={f}
              value={formData[f.key]}
              onChange={(key, value) => setFormData((prev) => ({ ...prev, [key]: value }))}
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
            <button type="submit" className="rounded-sm bg-gold px-6 py-2.5 text-sm text-ink hover:bg-gold-light">
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CrudPage;
