import type { EventoAdmin } from '../admin/types';
import { apiUrl } from './api';

const BASE_URL = apiUrl('/api/eventos');

export type EventoInput = Omit<EventoAdmin, 'id' | 'media'> & { mediaFile?: File | null };
export interface AsistenteEvento {
  id: string;
  clienteId: string;
  nombreCompleto: string;
  telefono: string;
  email: string;
  pago: number;
  debe: number;
  estado: 'Pagado' | 'Pendiente';
}

export type AsistenteEventoInput = Pick<AsistenteEvento, 'clienteId' | 'pago'>;

function formData(input: Partial<EventoInput>) {
  const data = new FormData();
  const fields = ['nombre', 'tipo', 'descripcion', 'fecha', 'hora', 'ubicacion', 'duracion', 'frase', 'queTrae', 'cupos', 'cuposDisponibles', 'precio', 'estado'] as const;
  fields.forEach((field) => {
    const value = input[field];
    if (value !== undefined && value !== null) data.append(field, String(value));
  });
  if (input.mediaFile) data.append('media_file', input.mediaFile);
  return data;
}

export function resolveEventoMediaUrl(media: string) {
  return apiUrl(media);
}

export async function fetchEventos(): Promise<EventoAdmin[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error('No se pudieron cargar los eventos');
  return (await response.json()) as EventoAdmin[];
}

export async function createEvento(input: EventoInput): Promise<EventoAdmin> {
  const response = await fetch(BASE_URL, { method: 'POST', body: formData(input) });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail ?? 'No se pudo crear el evento');
  return (await response.json()) as EventoAdmin;
}

export async function updateEvento(id: string, input: Partial<EventoInput>): Promise<EventoAdmin> {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'PATCH', body: formData(input) });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail ?? 'No se pudo actualizar el evento');
  return (await response.json()) as EventoAdmin;
}

export async function deleteEvento(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('No se pudo eliminar el evento');
}

export async function fetchAsistentesEvento(eventoId: string): Promise<AsistenteEvento[]> {
  const response = await fetch(`${BASE_URL}/${eventoId}/asistentes`);
  if (!response.ok) throw new Error('No se pudieron cargar los asistentes');
  return (await response.json()) as AsistenteEvento[];
}

export async function createAsistenteEvento(eventoId: string, input: AsistenteEventoInput): Promise<AsistenteEvento> {
  const response = await fetch(`${BASE_URL}/${eventoId}/asistentes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail ?? 'No se pudo registrar el asistente');
  return (await response.json()) as AsistenteEvento;
}

export async function addPagoAsistente(eventoId: string, asistenteId: string, pago: number): Promise<AsistenteEvento> {
  const response = await fetch(`${BASE_URL}/${eventoId}/asistentes/${asistenteId}/pagos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pago }) });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail ?? 'No se pudo registrar el pago');
  return (await response.json()) as AsistenteEvento;
}
