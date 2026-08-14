import { apiUrl } from './api';

const BASE_URL = apiUrl('/api/categorias');

export interface Categoria {
  id: string;
  nombre: string;
}

export interface CategoriaInput {
  nombre: string;
}

async function request(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail ?? 'No se pudo realizar la operación');
  return response;
}

export async function fetchCategorias(): Promise<Categoria[]> {
  return (await request(BASE_URL)).json() as Promise<Categoria[]>;
}

export async function createCategoria(input: CategoriaInput): Promise<Categoria> {
  return (await request(BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })).json() as Promise<Categoria>;
}

export async function deleteCategoria(id: string): Promise<void> {
  await request(`${BASE_URL}/${id}`, { method: 'DELETE' });
}