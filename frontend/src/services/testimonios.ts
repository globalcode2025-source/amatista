import type { TestimonioAdmin } from '../admin/types';
import { apiUrl, getAuthHeaders } from './api';

const BASE = apiUrl('/api/testimonios');
type CreateInput = Pick<TestimonioAdmin, 'nombre' | 'descripcion' | 'tipo'>;

const message = async (response: Response) => (await response.json().catch(() => null))?.detail ?? 'No se pudo guardar el testimonio.';

export async function fetchTestimonios() {
  const response = await fetch(BASE);
  if (!response.ok) throw new Error('No se pudieron cargar los testimonios.');
  return await response.json() as TestimonioAdmin[];
}

export async function fetchTestimoniosPublicos() {
  const response = await fetch(`${BASE}/public`);
  if (!response.ok) throw new Error('No se pudieron cargar los testimonios.');
  return await response.json() as TestimonioAdmin[];
}

export async function createTestimonio(input: CreateInput) {
  const response = await fetch(BASE, { 
    method: 'POST', 
    headers: getAuthHeaders(), 
    body: JSON.stringify(input) 
  });
  if (!response.ok) throw new Error(await message(response));
  return await response.json() as TestimonioAdmin;
}

export async function updateEstadoTestimonio(id: string, estado: 'Aceptado' | 'Rechazado') {
  const response = await fetch(`${BASE}/${id}/estado`, { 
    method: 'PATCH', 
    headers: getAuthHeaders(), 
    body: JSON.stringify({ estado }) 
  });
  if (!response.ok) throw new Error(await message(response));
  return await response.json() as TestimonioAdmin;
}
