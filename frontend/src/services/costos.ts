import type { CostoProduccion, MaterialCosto } from '../admin/types';
import { apiUrl, getAuthHeaders } from './api';

const BASE_URL = apiUrl('/api/costos');
export type CostoProduccionInput = { productoId: string; tipo?: string; cantidadProducida: number; materiales: Omit<MaterialCosto, 'id' | 'proveedorNombre'>[] };

async function request(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail ?? 'No se pudo guardar el costo de producción.');
  return response;
}

export async function fetchCostos(): Promise<CostoProduccion[]> { 
  return (await request(BASE_URL)).json() as Promise<CostoProduccion[]>; 
}

export async function createCosto(input: CostoProduccionInput): Promise<CostoProduccion> { 
  return (await request(BASE_URL, { 
    method: 'POST', 
    body: JSON.stringify(input) 
  })).json() as Promise<CostoProduccion>; 
}

export async function updateCosto(id: string, input: CostoProduccionInput): Promise<CostoProduccion> { 
  return (await request(`${BASE_URL}/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(input) 
  })).json() as Promise<CostoProduccion>; 
}

export async function deleteCosto(id: string): Promise<void> { 
  await request(`${BASE_URL}/${id}`, { 
    method: 'DELETE'
  }); 
}
