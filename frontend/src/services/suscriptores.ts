import { apiUrl } from './api';

const BASE_URL = apiUrl('/api/suscriptores');

export interface Suscriptor {
  id: string;
  correo: string;
  fecha: string;
}

export interface SuscriptorInput {
  correo: string;
}

async function request(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail ?? 'No se pudo realizar la operación');
  return response;
}

export async function fetchSuscriptores(): Promise<Suscriptor[]> {
  return (await request(BASE_URL)).json() as Promise<Suscriptor[]>;
}

export async function createSuscriptor(input: SuscriptorInput): Promise<Suscriptor> {
  return (await request(BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })).json() as Promise<Suscriptor>;
}