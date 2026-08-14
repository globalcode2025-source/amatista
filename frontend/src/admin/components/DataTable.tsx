import type { ReactNode } from 'react';
import { useState } from 'react';
import { Modal } from './Modal';

export interface ColumnConfig<T = any> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T extends { id: string }> {
  columns: ColumnConfig<T>[];
  rows: T[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  onView?: (row: T) => void;
  viewLabel?: string;
  whatsappUrl?: (row: T) => string | null;
  onRowDoubleClick?: (row: T) => void;
  onPayment?: (row: T) => void;
  emptyLabel?: string;
}

const defaultWhatsappUrl = (row: { id: string }) => {
  const phone = String((row as any).telefono ?? '').replace(/\D/g, '');
  if (phone.length < 10) return null;
  return `https://wa.me/${phone.length === 10 && phone.startsWith('3') ? `57${phone}` : phone}`;
};

export function DataTable<T extends { id: string }>({ columns, rows, onEdit, onDelete, onView, viewLabel = 'Ver detalles', whatsappUrl = defaultWhatsappUrl, onRowDoubleClick, onPayment, emptyLabel }: DataTableProps<T>) {
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
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
              <th key={c.key} className={`whitespace-nowrap px-5 py-3.5 text-[0.72rem] uppercase tracking-wide text-ink/55 ${c.className ?? ''}`}>
                {c.label}
              </th>
            ))}
            <th className="px-5 py-3.5 text-right text-[0.72rem] uppercase tracking-wide text-ink/55">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} onDoubleClick={() => onRowDoubleClick?.(row)} className={`border-b border-ink/6 transition-colors last:border-0 hover:bg-cream/40 ${onRowDoubleClick ? 'cursor-pointer' : ''}`}>
              {columns.map((c) => (
                <td key={c.key} className={`px-5 py-4 text-ink/80 ${c.className ?? ''}`}>
                  {c.render ? c.render(row) : String((row as any)[c.key] ?? '—')}
                </td>
              ))}
              <td className="whitespace-nowrap px-5 py-4 text-right">
                {onView && (
                  <button type="button" onClick={() => onView(row)} aria-label={viewLabel} title={viewLabel} className="mr-4 align-middle text-amatista-mid hover:text-amatista-deep">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2"><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18M16 14h2" /></svg>
                  </button>
                )}
                {onPayment && (
                  <button
                    type="button"
                    onClick={() => onPayment(row)}
                    aria-label="Ver pagos"
                    title="Ver pagos"
                    className="mr-4 align-middle text-success hover:text-success/80"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onEdit(row)}
                  aria-label="Editar"
                  title="Editar"
                  className="mr-4 align-middle text-amatista-mid hover:text-amatista-deep"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2"><path d="m4 16.5-.8 4.3 4.3-.8L18.8 8.7 15.3 5.2 4 16.5Z"/><path d="m13.8 6.7 3.5 3.5"/></svg>
                </button>
                {whatsappUrl?.(row) && (
                  <a href={whatsappUrl(row)!} target="_blank" rel="noreferrer" aria-label={`Hablar por WhatsApp con ${(row as any).nombre ?? 'cliente'}`} title="Hablar por WhatsApp" className="mr-4 inline-block align-middle text-[#25D366] hover:opacity-70">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current"><path d="M12 2a9.8 9.8 0 0 0-8.4 14.9L2 22l5.3-1.5A10 10 0 1 0 12 2Zm0 18.1a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-3.1.9.9-3-.2-.3A8.1 8.1 0 1 1 12 20.1Zm4.4-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8.9-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-1.9-1.2 7.1 7.1 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.5.2-.4c.1-.1 0-.3 0-.4l-.8-1.9c-.2-.5-.5-.4-.7-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 3.9 3.5.5.2 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3Z" /></svg>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setPendingDelete(row)}
                  aria-label="Eliminar"
                  title="Eliminar"
                  className="align-middle text-danger hover:opacity-70"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2"><path d="M4 7h16M9 7V4h6v3m-9 0 1 14h10l1-14M10 11v6m4-6v6"/></svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal open={Boolean(pendingDelete)} title="Confirmar eliminación" onClose={() => setPendingDelete(null)}>
        <p className="text-center text-sm leading-relaxed text-ink/70">¿Estás seguro de que quieres eliminar este registro? Esta acción no se puede deshacer.</p>
        <div className="mt-7 flex justify-center gap-3"><button type="button" onClick={() => setPendingDelete(null)} className="px-5 py-2.5 text-sm text-ink/60">Cancelar</button><button type="button" onClick={() => { if (pendingDelete) onDelete(pendingDelete); setPendingDelete(null); }} className="rounded-sm bg-danger px-6 py-2.5 text-sm text-white">Eliminar</button></div>
      </Modal>
    </div>
  );
}

export default DataTable;
