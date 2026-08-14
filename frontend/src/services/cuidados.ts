import type { Cuidado } from '../admin/types';
import { apiUrl } from './api';

const BASE = apiUrl('/api/cuidados');

const message = async (r: Response) => 
  (await r.json().catch(() => null))?.detail ?? 'No se pudo guardar el cuidado';

export async function fetchCuidados() {
  const r = await fetch(BASE);
  if (!r.ok) throw new Error('No se pudieron cargar los cuidados');
  return await r.json() as Cuidado[];
}

export async function createCuidado(data: Omit<Cuidado, 'id'>) {
  const r = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(await message(r));
  return await r.json() as Cuidado;
}

export async function updateCuidado(id: string, data: Partial<Cuidado>) {
  const r = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(await message(r));
  return await r.json() as Cuidado;
}

export async function deleteCuidado(id: string) {
  const r = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!r.ok) throw new Error('No se pudo eliminar el cuidado');
}