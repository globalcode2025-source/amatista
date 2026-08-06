import { Link } from 'react-router-dom';

export interface Product {
  name: string;
  tag: string;
  price: string;
  desc: string;
  gradient: string;
  icon: string; // contenido interno del <svg> (paths)
}

const PRODUCTS: Product[] = [
  {
    name: 'Vela Luna Nueva',
    tag: 'edición luna',
    price: '$45.000',
    desc: 'Soya, lavanda y sándalo. Para rituales de cierre y noches de introspección.',
    gradient: 'from-[#5b3f70] to-[#7A5C94]',
    icon: '<path d="M50 10c4 7 8 10 8 15a8 8 0 1 1-16 0c0-5 4-8 8-15Z"/><path d="M30 35c0-6 5-9 9-9h22c4 0 9 3 9 9v14c0 15-13 24-20 24s-20-9-20-24V35Z"/>',
  },
  {
    name: 'Wax Melts Amatista',
    tag: 'para tu fusor',
    price: '$28.000',
    desc: 'Set x6 en cera de soya — vainilla ahumada, cítricos y flor de amatista.',
    gradient: 'from-[#3c2748] to-[#5b3f70]',
    icon: '<rect x="30" y="28" width="40" height="40" rx="3"/><path d="M38 28v-8h24v8"/><circle cx="50" cy="48" r="9"/>',
  },
  {
    name: 'Vela Ojo Protector',
    tag: 'protección',
    price: '$52.000',
    desc: 'Geranio y cedro, en vaso con el símbolo hamsa grabado a mano.',
    gradient: 'from-[#7A5C94] to-[#9c85b1]',
    icon: '<path d="M20 42c0-8 7-13 12-13h36c5 0 12 5 12 13v10c0 18-14 28-30 28S20 70 20 52V42Z"/><circle cx="50" cy="50" r="6" fill="#F4EEE3" stroke="none"/>',
  },
  {
    name: 'Corazón Kintsugi',
    tag: 'pieza única',
    price: '$95.000',
    desc: 'Cerámica intervenida con oro — cada grieta cuenta una historia distinta.',
    gradient: 'from-[#BE9B5E] to-[#8f7245]',
    icon: '<path d="M50 72C30 58 20 46 20 34a14 14 0 0 1 27-6 14 14 0 0 1 27 6c0 12-10 24-24 38Z"/><path d="M40 40l8 8-6 8 8 10" stroke-width="1.3"/>',
  },
  {
    name: 'Kit Ritual de Sanación',
    tag: 'para regalar',
    price: '$120.000',
    desc: 'Vela, piedra amatista natural y guía de intención — listo para obsequiar.',
    gradient: 'from-[#362043] to-[#241825]',
    icon: '<rect x="24" y="24" width="52" height="52" rx="4"/><path d="M50 34c8 12 14 17 14 24a14 14 0 1 1-28 0c0-7 6-12 14-24Z" fill="#E4C892" stroke="none" opacity=".85"/>',
  },
  {
    name: 'Difusor Aromas de Origen',
    tag: 'aroma constante',
    price: '$60.000',
    desc: 'Varillas de ratán y esencia botánica de larga duración para el hogar.',
    gradient: 'from-[#9c85b1] to-[#7A5C94]',
    icon: '<path d="M50 20v55M50 20l-16 8M50 20l16 8M40 34l20-6M40 45l20-6"/><ellipse cx="50" cy="78" rx="16" ry="5"/>',
  },
];

export function Productos() {
  return (
    <section id="productos" className="py-[120px]">
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="mb-16 max-w-[640px]">
          <span className="font-hand text-[1.3rem] text-gold">De nuestras manos a tu espacio</span>
          <h2 className="mt-2 font-serif text-[clamp(2.1rem,3.6vw,3rem)] font-semibold text-ink">Productos</h2>
          <p className="mt-4 leading-relaxed text-ink/68">
            Cada pieza se vierte, aromatiza y etiqueta a mano en pequeños lotes — para que ninguna vela llegue igual a otra.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <article
              key={p.name}
              className="group flex flex-col overflow-hidden rounded-sm border border-ink/8 bg-white transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_26px_50px_-20px_rgba(54,32,67,0.28)]"
            >
              <div className={`relative flex aspect-square items-center justify-center bg-gradient-to-br ${p.gradient}`}>
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="#F4EEE3"
                  strokeWidth="1.6"
                  className="w-[52%] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2"
                  dangerouslySetInnerHTML={{ __html: p.icon }}
                />
              </div>
              <div className="flex flex-1 flex-col p-6 pb-[26px]">
                <span className="font-hand text-[1.05rem] text-gold">{p.tag}</span>
                <h3 className="mb-2 mt-1.5 font-serif text-[1.28rem] font-semibold text-ink">{p.name}</h3>
                <p className="flex-1 text-sm leading-relaxed text-ink/62">{p.desc}</p>
                <div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-4">
                  <span className="font-serif text-[1.15rem] font-semibold text-ink">{p.price}</span>
                  <a
                    href="#"
                    className="group/link text-[0.78rem] uppercase tracking-wide text-amatista-mid"
                  >
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

        <div className="mt-14 text-center">
          <Link
            to="/catalogo"
            className="inline-block rounded-sm border border-amatista-deep px-8 py-4 text-sm uppercase tracking-wider text-amatista-deep transition-all duration-300 hover:border-gold hover:bg-gold hover:text-ink"
          >
            Ver colección completa
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Productos;