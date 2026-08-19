import type { Proveedor } from '../admin/types';
import { apiUrl, getAuthHeaders } from './api';

const BASE_URL = apiUrl('/api/proveedores');
export type ProveedorInput = Omit<Proveedor, 'id'>;

async function errorMessage(response: Response, fallback: string) {
  return (await response.json().catch(() => null))?.detail ?? fallback;
}

export async function fetchProveedores(): Promise<Proveedor[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error(await errorMessage(response, 'No se pudieron cargar los proveedores.'));
  return response.json() as Promise<Proveedor[]>;
}

export async function createProveedor(input: ProveedorInput): Promise<Proveedor> {
  const response = await fetch(BASE_URL, { 
    method: 'POST', 
    headers: getAuthHeaders(), 
    body: JSON.stringify(input) 
  });
  if (!response.ok) throw new Error(await errorMessage(response, 'No se pudo guardar el proveedor.'));
  return response.json() as Promise<Proveedor>;
}

export async function updateProveedor(id: string, input: Partial<ProveedorInput>): Promise<Proveedor> {
  const response = await fetch(`${BASE_URL}/${id}`, { 
    method: 'PATCH', 
    headers: getAuthHeaders(), 
    body: JSON.stringify(input) 
  });
  if (!response.ok) throw new Error(await errorMessage(response, 'No se pudo actualizar el proveedor.'));
  return response.json() as Promise<Proveedor>;
}

export async function deleteProveedor(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, { 
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error(await errorMessage(response, 'No se pudo eliminar el proveedor.'));
}
