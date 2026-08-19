import type { Gasto } from '../admin/types';
import { apiUrl, getAuthHeaders } from './api';

const BASE_URL = apiUrl('/api/gastos');
export type GastoInput = Omit<Gasto, 'id'>;

async function parseError(response: Response, fallback: string) {
  const body = await response.json().catch(() => null);
  return body?.detail ?? fallback;
}

export async function fetchGastos(query?: string): Promise<Gasto[]> {
  const response = await fetch(query ? `${BASE_URL}?q=${encodeURIComponent(query)}` : BASE_URL);
  if (!response.ok) throw new Error(await parseError(response, 'No se pudieron cargar los gastos.'));
  return response.json() as Promise<Gasto[]>;
}

export async function createGasto(input: GastoInput): Promise<Gasto> {
  const response = await fetch(BASE_URL, { 
    method: 'POST', 
    headers: getAuthHeaders(), 
    body: JSON.stringify(input) 
  });
  if (!response.ok) throw new Error(await parseError(response, 'No se pudo guardar el gasto.'));
  return response.json() as Promise<Gasto>;
}

export async function updateGasto(id: string, input: Partial<GastoInput>): Promise<Gasto> {
  const response = await fetch(`${BASE_URL}/${id}`, { 
    method: 'PATCH', 
    headers: getAuthHeaders(), 
    body: JSON.stringify(input) 
  });
  if (!response.ok) throw new Error(await parseError(response, 'No se pudo actualizar el gasto.'));
  return response.json() as Promise<Gasto>;
}

export async function deleteGasto(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, { 
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error(await parseError(response, 'No se pudo eliminar el gasto.'));
}
