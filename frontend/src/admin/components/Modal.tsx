import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: 'default' | 'wide';
}

export function Modal({ open, title, onClose, children, size = 'default' }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-ink/50 p-4" onClick={onClose}>
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-sm bg-white p-6 shadow-2xl sm:p-8 ${size === 'wide' ? 'max-w-[920px]' : 'max-w-[640px]'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-serif text-xl font-semibold text-ink">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-xl leading-none text-ink/40 hover:text-ink">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
