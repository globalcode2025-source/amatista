import type { Pedido } from '../admin/types';
import { apiUrl, getAuthHeaders } from './api';

const BASE = apiUrl('/api/pedidos-gestion');

export async function fetchPedidosGestion(estado?: string, search?: string): Promise<Pedido[]> {
  const params = new URLSearchParams();
  if (estado) params.append('estado', estado);
  if (search) params.append('search', search);
  
  const url = params.toString() ? `${BASE}?${params.toString()}` : BASE;
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('No se pudieron cargar los pedidos');
  }
  
  return response.json() as Promise<Pedido[]>;
}

export async function fetchPedidoGestion(id: string): Promise<Pedido> {
  const response = await fetch(`${BASE}/${id}`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('No se pudo cargar el pedido');
  }
  
  return response.json() as Promise<Pedido>;
}

export async function updatePedidoEstado(id: string, estado: string): Promise<Pedido> {
  const response = await fetch(`${BASE}/${id}/estado?estado=${encodeURIComponent(estado)}`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'No se pudo actualizar el estado del pedido');
  }
  
  return response.json() as Promise<Pedido>;
}