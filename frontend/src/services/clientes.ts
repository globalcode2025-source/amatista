import type { Cliente } from '../admin/types';
import { apiUrl } from './api';

const BASE_URL = apiUrl('/api/clientes');
export type ClienteInput = Omit<Cliente, 'id'>;

async function parseError(response: Response, fallback: string) {
  const body = await response.json().catch(() => null);
  return body?.detail ?? fallback;
}

export async function fetchClientes(query?: string): Promise<Cliente[]> {
  const response = await fetch(query ? `${BASE_URL}?q=${encodeURIComponent(query)}` : BASE_URL);
  if (!response.ok) throw new Error(await parseError(response, 'No se pudieron cargar los clientes'));
  return (await response.json()) as Cliente[];
}

export async function createCliente(input: ClienteInput): Promise<Cliente> {
  const response = await fetch(BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
  if (!response.ok) throw new Error(await parseError(response, 'No se pudo crear el cliente'));
  return (await response.json()) as Cliente;
}

export async function updateCliente(id: string, input: Partial<ClienteInput>): Promise<Cliente> {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
  if (!response.ok) throw new Error(await parseError(response, 'No se pudo actualizar el cliente'));
  return (await response.json()) as Cliente;
}

export async function deleteCliente(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error(await parseError(response, 'No se pudo eliminar el cliente'));
}
