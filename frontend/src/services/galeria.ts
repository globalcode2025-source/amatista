import type { GaleriaAdmin, TipoContenido } from '../admin/types';
import { apiUrl, getAuthHeaders } from './api';

const BASE_URL = apiUrl('/api/galeria');

export interface GaleriaInput {
  titulo: string;
  tipo: TipoContenido;
  descripcion: string;
  mediaFile?: File | null;
}

function buildFormData(input: GaleriaInput) {
  const formData = new FormData();
  formData.append('titulo', input.titulo);
  formData.append('tipo', input.tipo);
  formData.append('descripcion', input.descripcion);
  if (input.mediaFile) {
    formData.append('media_file', input.mediaFile);
  }
  return formData;
}

export function resolveMediaUrl(media: string) {
  return apiUrl(media);
}

export async function fetchGaleria(): Promise<GaleriaAdmin[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error('No se pudo cargar la galería');
  }
  return (await response.json()) as GaleriaAdmin[];
}

export async function createGaleria(input: GaleriaInput): Promise<GaleriaAdmin> {
  const headers = getAuthHeaders();
  delete (headers as any)['Content-Type']; // Para multipart/form-data
  
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: buildFormData(input),
  });
  if (!response.ok) {
    throw new Error('No se pudo crear el elemento de galería');
  }
  return (await response.json()) as GaleriaAdmin;
}

export async function updateGaleria(id: string, input: Partial<GaleriaInput>): Promise<GaleriaAdmin> {
  const headers = getAuthHeaders();
  delete (headers as any)['Content-Type']; // Para multipart/form-data
  
  const formData = new FormData();
  if (input.titulo !== undefined) formData.append('titulo', input.titulo);
  if (input.tipo !== undefined) formData.append('tipo', input.tipo);
  if (input.descripcion !== undefined) formData.append('descripcion', input.descripcion);
  if (input.mediaFile) formData.append('media_file', input.mediaFile);

  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers,
    body: formData,
  });
  if (!response.ok) {
    throw new Error('No se pudo actualizar el elemento de galería');
  }
  return (await response.json()) as GaleriaAdmin;
}

export async function deleteGaleria(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, { 
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('No se pudo eliminar el elemento de galería');
  }
}
