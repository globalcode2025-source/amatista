import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ProductoAdmin } from '../admin/types';
import { fetchProductos, resolveProductoImage } from '../services/productos';

export function Productos() {
  const [items, setItems] = useState<ProductoAdmin[]>([]);

  useEffect(() => {
    fetchProductos(false).then(setItems).catch(() => setItems([])); // Solo productos activos
  }, []);

  const discountIsValid = (p: ProductoAdmin) => {
    if (!p.precio_descuento) return false;
    if (!p.fecha_inicio_descuento && !p.fecha_fin_descuento) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (p.fecha_inicio_descuento) {
      const startDate = new Date(p.fecha_inicio_descuento);
      if (today < startDate) return false;
    }
    if (p.fecha_fin_descuento) {
      const endDate = new Date(p.fecha_fin_descuento);
      if (today > endDate) return false;
    }
    return true;
  };

  const displayPrice = (p: ProductoAdmin) => {
    if (discountIsValid(p)) {
      return p.precio_descuento!.toLocaleString('es-CO');
    }
    return p.precio.toLocaleString('es-CO');
  };

  return (
    <section id="productos" className="py-[120px]">
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="mb-16 max-w-[640px]">
          <span className="font-hand text-[1.3rem] text-gold">De nuestras manos a tu espacio</span>
          <h2 className="mt-2 font-serif text-[clamp(2.1rem,3.6vw,3rem)] font-semibold text-ink">Productos</h2>
        </div>
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map(p => (
            <article key={p.id} className="group relative flex flex-col overflow-hidden rounded-sm border border-ink/8 bg-white">
              {p.descuento && discountIsValid(p) && (
                <div className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
                  -{p.descuento}%
                </div>
              )}
              <img src={resolveProductoImage(p.imagen)} alt={p.nombre} className="aspect-square w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400/f5f0e8/241825?text=Imagen+no+disponible'; }} />
              <div className="flex flex-1 flex-col p-6 pb-[26px]">
                <span className="font-hand text-[1.05rem] text-gold">{p.categoria}</span>
                <h3 className="mb-2 mt-1.5 font-serif text-[1.28rem] font-semibold text-ink">{p.nombre}</h3>
                <p className="flex-1 text-sm leading-relaxed text-ink/62">{p.descripcion}</p>
                <div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-4">
                  <div className="flex flex-col">
                    {discountIsValid(p) && (
                      <span className="text-xs text-ink/40 line-through">
                        ${p.precio.toLocaleString('es-CO')}
                      </span>
                    )}
                    <span className="font-serif text-[1.15rem] font-semibold text-ink">
                      ${displayPrice(p)}
                    </span>
                  </div>
                  <a href="https://wa.me/573147325051" className="text-[.78rem] uppercase tracking-wide text-amatista-mid">Comprar →</a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link to="/catalogo" className="inline-block rounded-sm border border-amatista-deep px-8 py-4 text-sm uppercase tracking-wider text-amatista-deep">
            Ver colección completa
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Productos;
