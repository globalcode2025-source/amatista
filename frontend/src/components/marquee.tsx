export interface MarqueeProps {
  items?: string[];
}

const DEFAULT_ITEMS = [
  'Velas artesanales',
  'Wax melts',
  'Taller de Kintsugi',
  'El Retiro, Antioquia',
  'Envíos a toda Colombia',
];

export function Marquee({ items = DEFAULT_ITEMS }: MarqueeProps) {
  // se duplica la lista para que el loop de la animación sea continuo (sin salto visible)
  const doubled = [...items, ...items];

  return (
    <div className="relative z-[3] overflow-hidden whitespace-nowrap bg-gold py-[13px] text-ink">
      <div className="inline-block animate-marquee hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2.5 px-[26px] font-serif text-[0.95rem] italic uppercase tracking-[0.02em]">
            {item}
            <span aria-hidden="true">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;