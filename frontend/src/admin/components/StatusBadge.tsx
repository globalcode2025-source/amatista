import type { EstadoPedido } from '../types';

const STYLES: Record<EstadoPedido, string> = {
  Pendiente: 'bg-gold/15 text-gold',
  'En proceso': 'bg-info/15 text-info',
  Despachado: 'bg-amatista-mid/15 text-amatista-mid',
  Entregado: 'bg-success/15 text-success',
};

export function StatusBadge({ estado }: { estado: EstadoPedido }) {
  return <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${STYLES[estado]}`}>{estado}</span>;
}

export default StatusBadge;