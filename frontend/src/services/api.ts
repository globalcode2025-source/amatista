const DEFAULT_BACKEND_URL = 'http://localhost:8000';

export const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string | undefined)?.replace(/\/$/, '') ?? DEFAULT_BACKEND_URL;

export function apiUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BACKEND_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}
