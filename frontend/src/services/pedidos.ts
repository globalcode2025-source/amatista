import type { PagoVenta, Pedido } from '../admin/types';
import { apiUrl, getAuthHeaders } from './api';

const BASE = apiUrl('/api/pedidos');
type VentaItemInput = { productoId: string; cantidad: number };
export type CreateInput = { clienteId: string; formaPago: string; notas?: string; productos: VentaItemInput[]; pagoInicial?: number };
export type UpdateInput = Partial<CreateInput>;

const message = async (r: Response) => (await r.json().catch(() => null))?.detail ?? 'No se pudo guardar la venta';

export async function fetchPedidos() {
  const r = await fetch(BASE);
  if (!r.ok) throw new Error('No se pudieron cargar los pedidos');
  return await r.json() as Pedido[];
}

export async function createPedido(i: CreateInput) {
  const r = await fetch(BASE, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(i)
  });
  if (!r.ok) throw new Error(await message(r));
  return await r.json() as Pedido;
}

export async function updatePedido(id: string, i: Partial<UpdateInput>) {
  const r = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(i)
  });
  if (!r.ok) throw new Error(await message(r));
  return await r.json() as Pedido;
}

export async function deletePedido(id: string) {
  const r = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!r.ok) throw new Error('No se pudo eliminar el pedido');
}

export async function fetchPagosPedido(id: string) {
  const r = await fetch(`${BASE}/${id}/pagos`);
  if (!r.ok) throw new Error('No se pudieron cargar los pagos');
  return await r.json() as PagoVenta[];
}

export async function createPagoPedido(id: string, monto: number) {
  const r = await fetch(`${BASE}/${id}/pagos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ monto })
  });
  if (!r.ok) throw new Error(await message(r));
  return await r.json() as PagoVenta;
}
