import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ProductoAdmin } from '../admin/types';
import { fetchProductos, resolveProductoImage } from '../services/productos';
import Footer from '../components/footer';

const money = (value: number) => `$${value.toLocaleString('es-CO')}`;

export default function Catalogo() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('todas');
  const [products, setProducts] = useState<ProductoAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProducts(await fetchProductos());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los productos.');
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const categories = useMemo(() => {
    const names = Array.from(new Set(products.map((product) => product.categoria.trim()).filter(Boolean)));
    return [{ key: 'todas', label: 'Todas' }, ...names.map((name) => ({ key: name.toLocaleLowerCase(), label: name }))];
  }, [products]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === 'todas' || product.categoria.toLocaleLowerCase() === category;
      const matchesSearch = !normalizedQuery || [product.nombre, product.descripcion, product.categoria]
        .some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
      return matchesCategory && matchesSearch;
    });
  }, [category, products, query]);

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-[200] bg-cream/95 py-4 shadow-[0_1px_0_rgba(36,24,37,0.06)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-8">
          <Link to="/#inicio" className="flex items-center font-serif text-[1.35rem] font-semibold uppercase tracking-[0.06em] text-amatista-deep">
            Amatista
          </Link>
          <Link to="/#inicio" className="text-[0.82rem] uppercase tracking-[0.05em] text-amatista-mid hover:text-amatista-deep">← Volver al inicio</Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[linear-gradient(160deg,#362043_0%,#2a1735_60%,#241825_100%)] py-[72px] text-center text-cream">
        <div className="relative z-[1] mx-auto max-w-[1180px] px-8">
          <span className="font-hand text-[1.3rem] text-gold">De nuestras manos a tu espacio</span>
          <h1 className="mb-3.5 mt-2.5 font-serif text-[clamp(2rem,4.4vw,3.2rem)] font-semibold">Catálogo completo</h1>
          <p className="mx-auto max-w-[520px] text-cream/75">Explora los productos disponibles. Busca por nombre o filtra por categoría.</p>
          <div className="mx-auto mt-9 flex max-w-[760px] flex-col items-center gap-[18px]">
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre, descripción o categoría..." className="w-full rounded-sm border border-cream/25 bg-cream/[0.08] px-5 py-3.5 text-[0.95rem] text-cream placeholder:text-cream/45 focus:outline-none" />
            <div className="flex flex-wrap justify-center gap-2.5">
              {categories.map((item) => <button key={item.key} type="button" onClick={() => setCategory(item.key)} className={`rounded-full border px-[18px] py-2.5 text-[0.8rem] tracking-[0.03em] transition-all ${category === item.key ? 'border-gold bg-gold text-ink' : 'border-cream/30 text-cream/80 hover:border-gold'}`}>{item.label}</button>)}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 pb-[100px]">
        <div className="mx-auto max-w-[1180px] px-8">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-2.5"><span className="text-[0.85rem] text-ink/55">{loading ? 'Cargando productos...' : `Mostrando ${filtered.length} producto${filtered.length === 1 ? '' : 's'}`}</span><span className="text-[0.85rem] text-ink/55">Precios en COP</span></div>
          {error ? <div className="py-20 text-center text-ink/55"><h2 className="mb-2 font-serif text-xl text-ink">No fue posible cargar el catálogo</h2><p>{error}</p></div> : loading ? <div className="py-20 text-center text-ink/55">Cargando productos...</div> : filtered.length === 0 ? <div className="py-20 text-center text-ink/55"><h2 className="mb-2 font-serif text-xl text-ink">No encontramos productos</h2><p>Intenta con otra palabra o quita el filtro de categoría.</p></div> : <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => <article key={product.id} className="group flex flex-col overflow-hidden rounded-sm border border-ink/8 bg-white transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_26px_50px_-20px_rgba(54,32,67,0.28)]">
              <img src={resolveProductoImage(product.imagen)} alt={product.nombre} className="aspect-square w-full object-cover" />
              <div className="flex flex-1 flex-col p-6 pb-[26px]"><span className="font-hand text-[1.05rem] text-gold">{product.categoria}</span><h2 className="mb-2 mt-1.5 font-serif text-[1.22rem] font-semibold text-ink">{product.nombre}</h2><p className="flex-1 text-sm leading-relaxed text-ink/62">{product.descripcion}</p><div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-4"><span className="font-serif text-[1.1rem] font-semibold text-ink">{money(product.precio)}</span>{product.stock > 0 ? <a href="https://wa.me/573000000000" target="_blank" rel="noopener noreferrer" className="text-[0.75rem] uppercase tracking-wide text-amatista-mid transition-colors hover:text-gold">Comprar →</a> : <span className="text-[0.75rem] text-ink/50">Agotado</span>}</div></div>
            </article>)}
          </div>}
        </div>
      </section>
      <Footer />
    </div>
  );
}
