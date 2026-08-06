import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  name: string;
  cat: string;
  catLabel: string;
  tag: string;
  price: number;
  desc: string;
  gradient: string;
  icon: string;
}

const ICONS: Record<string, string> = {
  candle:
    '<path d="M50 10c4 7 8 10 8 15a8 8 0 1 1-16 0c0-5 4-8 8-15Z"/><path d="M30 35c0-6 5-9 9-9h22c4 0 9 3 9 9v14c0 15-13 24-20 24s-20-9-20-24V35Z"/>',
  eye: '<path d="M20 42c0-8 7-13 12-13h36c5 0 12 5 12 13v10c0 18-14 28-30 28S20 70 20 52V42Z"/><circle cx="50" cy="50" r="6" fill="#F4EEE3" stroke="none"/>',
  sun: '<circle cx="50" cy="50" r="14"/><path d="M50 22v10M50 68v10M22 50h10M68 50h10M31 31l7 7M69 31l-7 7M31 69l7-7M69 69l-7-7"/>',
  flame: '<path d="M50 78C30 62 20 48 20 34a14 14 0 0 1 27-6 14 14 0 0 1 27 6c0 14-10 28-24 44Z"/>',
  melt: '<rect x="30" y="28" width="40" height="40" rx="3"/><path d="M38 28v-8h24v8"/><circle cx="50" cy="48" r="9"/>',
  heart:
    '<path d="M50 72C30 58 20 46 20 34a14 14 0 0 1 27-6 14 14 0 0 1 27 6c0 12-10 24-24 38Z"/><path d="M40 40l8 8-6 8 8 10" stroke-width="1.3"/>',
  vase: '<path d="M40 20h20l4 14-6 6c6 6 8 12 8 20 0 12-9 20-16 20s-16-8-16-20c0-8 2-14 8-20l-6-6 4-14Z"/>',
  gift:
    '<rect x="24" y="24" width="52" height="52" rx="4"/><path d="M50 34c8 12 14 17 14 24a14 14 0 1 1-28 0c0-7 6-12 14-24Z" fill="#E4C892" stroke="none" opacity=".85"/>',
  diffuser: '<path d="M50 20v55M50 20l-16 8M50 20l16 8M40 34l20-6M40 45l20-6"/><ellipse cx="50" cy="78" rx="16" ry="5"/>',
};

const PRODUCTS: Product[] = [
  { name: 'Vela Luna Nueva', cat: 'velas', catLabel: 'Velas', tag: 'edición luna', price: 45000, desc: 'Soya, lavanda y sándalo. Para rituales de cierre y noches de introspección.', gradient: 'from-[#5b3f70] to-[#7A5C94]', icon: 'candle' },
  { name: 'Vela Ojo Protector', cat: 'velas', catLabel: 'Velas', tag: 'protección', price: 52000, desc: 'Geranio y cedro, en vaso con el símbolo hamsa grabado a mano.', gradient: 'from-[#7A5C94] to-[#9c85b1]', icon: 'eye' },
  { name: 'Vela Amanecer Cítrico', cat: 'velas', catLabel: 'Velas', tag: 'energía', price: 48000, desc: 'Naranja, bergamota y jengibre. Ideal para empezar el día con claridad.', gradient: 'from-[#BE9B5E] to-[#E4C892]', icon: 'sun' },
  { name: 'Vela Ritual de Fuego', cat: 'velas', catLabel: 'Velas', tag: 'transformación', price: 50000, desc: 'Canela, clavo y madera. Para rituales de intención y cambio.', gradient: 'from-[#362043] to-[#5b3f70]', icon: 'flame' },
  { name: 'Wax Melts Amatista', cat: 'wax', catLabel: 'Wax Melts', tag: 'para tu fusor', price: 28000, desc: 'Set x6 en cera de soya — vainilla ahumada, cítricos y flor de amatista.', gradient: 'from-[#3c2748] to-[#5b3f70]', icon: 'melt' },
  { name: 'Wax Melts Bosque Nocturno', cat: 'wax', catLabel: 'Wax Melts', tag: 'aroma profundo', price: 28000, desc: 'Musgo, cedro y notas amaderadas para las noches de calma.', gradient: 'from-[#241825] to-[#362043]', icon: 'melt' },
  { name: 'Corazón Kintsugi', cat: 'kintsugi', catLabel: 'Kintsugi', tag: 'pieza única', price: 95000, desc: 'Cerámica intervenida con oro — cada grieta cuenta una historia distinta.', gradient: 'from-[#BE9B5E] to-[#8f7245]', icon: 'heart' },
  { name: 'Vasija Kintsugi Pequeña', cat: 'kintsugi', catLabel: 'Kintsugi', tag: 'pieza única', price: 110000, desc: 'Vasija reparada a mano con la técnica japonesa del oro. Ideal para decorar.', gradient: 'from-[#8f7245] to-[#BE9B5E]', icon: 'vase' },
  { name: 'Kit Ritual de Sanación', cat: 'kits', catLabel: 'Kits', tag: 'para regalar', price: 120000, desc: 'Vela, piedra amatista natural y guía de intención — listo para obsequiar.', gradient: 'from-[#362043] to-[#241825]', icon: 'gift' },
  { name: 'Kit Amiga Especial', cat: 'kits', catLabel: 'Kits', tag: 'para regalar', price: 98000, desc: 'Vela mini, wax melts y tarjeta escrita a mano. El regalo perfecto.', gradient: 'from-[#9c85b1] to-[#7A5C94]', icon: 'gift' },
  { name: 'Difusor Aromas de Origen', cat: 'difusores', catLabel: 'Difusores', tag: 'aroma constante', price: 60000, desc: 'Varillas de ratán y esencia botánica de larga duración para el hogar.', gradient: 'from-[#7A5C94] to-[#9c85b1]', icon: 'diffuser' },
  { name: 'Difusor Flor de Amatista', cat: 'difusores', catLabel: 'Difusores', tag: 'aroma floral', price: 65000, desc: 'Notas florales y amaderadas suaves, perfectas para espacios pequeños.', gradient: 'from-[#E4C892] to-[#BE9B5E]', icon: 'diffuser' },
];

const CATEGORIES = [
  { key: 'todas', label: 'Todas' },
  { key: 'velas', label: 'Velas' },
  { key: 'wax', label: 'Wax Melts' },
  { key: 'kintsugi', label: 'Kintsugi' },
  { key: 'kits', label: 'Kits' },
  { key: 'difusores', label: 'Difusores' },
];

const money = (n: number) => `$${n.toLocaleString('es-CO')}`;

export default function Catalogo() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('todas');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchesCat = category === 'todas' || p.cat === category;
      const matchesSearch =
        !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [query, category]);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header simple */}
      <header className="sticky top-0 z-[200] bg-cream/95 py-4 shadow-[0_1px_0_rgba(36,24,37,0.06)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-8">
          <Link to="/" className="flex items-center gap-2.5 font-serif text-[1.1rem] font-semibold uppercase tracking-[0.06em] text-amatista-deep">
            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" className="h-7 w-7">
              <path d="M20 4c2 4 4 5 4 8a4 4 0 1 1-8 0c0-3 2-4 4-8Z" strokeWidth="1.4" />
              <path d="M9 18c0-3 3-5 5-5h12c2 0 5 2 5 5v6c0 6-5 10-11 10S9 30 9 24v-6Z" strokeWidth="1.4" />
              <circle cx="20" cy="22" r="4" strokeWidth="1.4" />
            </svg>
            Amatista
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-[0.82rem] uppercase tracking-[0.05em] text-amatista-mid hover:text-amatista-deep">
            ← Volver al inicio
          </Link>
        </div>
      </header>

      {/* Banner */}
      <section className="relative overflow-hidden bg-[linear-gradient(160deg,#362043_0%,#2a1735_60%,#241825_100%)] py-[72px] text-center text-cream">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(122,92,148,0.4), transparent 65%)' }}
        />
        <div className="relative z-[1] mx-auto max-w-[1180px] px-8">
          <span className="font-hand text-[1.3rem] text-gold">De nuestras manos a tu espacio</span>
          <h1 className="mb-3.5 mt-2.5 font-serif text-[clamp(2rem,4.4vw,3.2rem)] font-semibold">Catálogo completo</h1>
          <p className="mx-auto max-w-[520px] text-cream/75">
            Explora todas nuestras velas, wax melts, kits y piezas kintsugi. Busca por nombre o filtra por categoría.
          </p>

          <div className="mx-auto mt-9 flex max-w-[760px] flex-col items-center gap-[18px]">
            <div className="flex w-full items-center gap-3 rounded-sm border border-cream/25 bg-cream/[0.08] px-5 py-3.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px] shrink-0 text-gold-light">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre o aroma… (ej. lavanda, kintsugi)"
                className="flex-1 bg-transparent text-[0.95rem] text-cream placeholder:text-cream/45 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key)}
                  className={`rounded-full border px-[18px] py-2.5 text-[0.8rem] tracking-[0.03em] transition-all duration-300 ${
                    category === c.key
                      ? 'border-gold bg-gold text-ink'
                      : 'border-cream/30 text-cream/80 hover:border-gold'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section className="py-16 pb-[100px]">
        <div className="mx-auto max-w-[1180px] px-8">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-2.5">
            <span className="text-[0.85rem] text-ink/55">
              Mostrando {filtered.length} producto{filtered.length === 1 ? '' : 's'}
            </span>
            <span className="text-[0.85rem] text-ink/55">Precios en COP</span>
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center text-ink/55">
              <h3 className="mb-2.5 font-serif text-xl text-ink">No encontramos productos</h3>
              <p>Intenta con otra palabra o quita el filtro de categoría.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <article
                  key={p.name}
                  className="group flex flex-col overflow-hidden rounded-sm border border-ink/8 bg-white transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_26px_50px_-20px_rgba(54,32,67,0.28)]"
                >
                  <div className={`relative flex aspect-square items-center justify-center bg-gradient-to-br ${p.gradient}`}>
                    <span className="absolute left-3 top-3 z-[1] rounded-full bg-ink/55 px-[11px] py-1.5 text-[0.68rem] uppercase tracking-[0.05em] text-cream backdrop-blur-sm">
                      {p.catLabel}
                    </span>
                    <svg
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="#F4EEE3"
                      strokeWidth="1.6"
                      className="w-[52%] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2"
                      dangerouslySetInnerHTML={{ __html: ICONS[p.icon] }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 pb-[26px]">
                    <span className="font-hand text-[1.05rem] text-gold">{p.tag}</span>
                    <h3 className="mb-2 mt-1.5 font-serif text-[1.22rem] font-semibold text-ink">{p.name}</h3>
                    <p className="flex-1 text-sm leading-relaxed text-ink/62">{p.desc}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-4">
                      <span className="font-serif text-[1.1rem] font-semibold text-ink">{money(p.price)}</span>
                      <a href="#" className="group/link text-[0.78rem] uppercase tracking-wide text-amatista-mid">
                        Añadir
                        <span className="ml-1 inline-block transition-transform duration-300 group-hover/link:translate-x-1">
                          →
                        </span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-amatista-deep py-10 text-center text-[0.82rem] text-cream/65">
        <div className="mx-auto max-w-[1180px] px-8">
          © 2026 Amatista Velas y Aromas ·{' '}
          <a href="/#eventos" className="text-gold-light">
            Taller de Kintsugi
          </a>{' '}
          ·{' '}
          <a href="/#ubicacion" className="text-gold-light">
            La Ceja, Antioquia
          </a>
        </div>
      </footer>
    </div>
  );
}