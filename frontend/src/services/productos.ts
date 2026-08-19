import type { ProductoAdmin } from '../admin/types';
import { apiUrl, getAuthHeaders } from './api';

const BASE = apiUrl('/api/productos');

export type ProductoInput = Omit<ProductoAdmin, 'id' | 'imagen'> & { imagenFile?: File | null };

const data = (input: Partial<ProductoInput>) => {
  const form = new FormData();
  (['nombre', 'categoria', 'precio', 'stock', 'descripcion'] as const).forEach(k => input[k] !== undefined && form.append(k, String(input[k])));
  if (input.imagenFile) form.append('imagen_file', input.imagenFile);
  return form;
};

const error = async (r: Response) => (await r.json().catch(() => null))?.detail ?? 'No se pudo guardar el producto';

export const resolveProductoImage = (image: string) => apiUrl(image);

export async function fetchProductos() {
  const r = await fetch(BASE);
  if (!r.ok) throw new Error('No se pudieron cargar los productos');
  return await r.json() as ProductoAdmin[];
}

export async function createProducto(input: ProductoInput) {
  const headers = getAuthHeaders();
  // Eliminar Content-Type para que el navegador establezca multipart/form-data
  delete (headers as any)['Content-Type'];
  
  const r = await fetch(BASE, {
    method: 'POST',
    headers,
    body: data(input)
  });
  if (!r.ok) throw new Error(await error(r));
  return await r.json() as ProductoAdmin;
}

export async function updateProducto(id: string, input: Partial<ProductoInput>) {
  const headers = getAuthHeaders();
  delete (headers as any)['Content-Type'];
  
  const r = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers,
    body: data(input)
  });
  if (!r.ok) throw new Error(await error(r));
  return await r.json() as ProductoAdmin;
}

export async function deleteProducto(id: string) {
  const r = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!r.ok) throw new Error('No se pudo eliminar el producto');
}
