import type { ReactNode } from 'react';

export interface ColumnConfig {
  key: string;
  label: string;
  render?: (row: any) => ReactNode;
  className?: string;
}

interface DataTableProps<T extends { id: string }> {
  columns: ColumnConfig[];
  rows: T[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  emptyLabel?: string;
}

export function DataTable<T extends { id: string }>({ columns, rows, onEdit, onDelete, emptyLabel }: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-sm border border-ink/10 bg-white py-16 text-center text-sm text-ink/50">
        {emptyLabel ?? 'No hay registros que coincidan con tu búsqueda.'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-ink/10 bg-white">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-ink/10 bg-cream/70 text-left">
            {columns.map((c) => (
              <th key={c.key} className="whitespace-nowrap px-5 py-3.5 text-[0.72rem] uppercase tracking-wide text-ink/55">
                {c.label}
              </th>
            ))}
            <th className="px-5 py-3.5 text-right text-[0.72rem] uppercase tracking-wide text-ink/55">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-ink/6 transition-colors last:border-0 hover:bg-cream/40">
              {columns.map((c) => (
                <td key={c.key} className={`px-5 py-4 text-ink/80 ${c.className ?? ''}`}>
                  {c.render ? c.render(row) : String((row as any)[c.key] ?? '—')}
                </td>
              ))}
              <td className="whitespace-nowrap px-5 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onEdit(row)}
                  className="mr-4 text-xs uppercase tracking-wide text-amatista-mid hover:text-amatista-deep"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(row)}
                  className="text-xs uppercase tracking-wide text-danger hover:opacity-70"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;