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
  return (
    <div className="relative z-[3] flex overflow-hidden whitespace-nowrap bg-gold py-[13px] text-ink select-none">
      {/* Pista 1 */}
      <div className="flex min-w-full shrink-0 animate-marquee items-center justify-around">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2.5 px-[26px] font-serif text-[0.95rem] italic uppercase tracking-[0.02em]"
          >
            {item}
            <span aria-hidden="true">·</span>
          </span>
        ))}
      </div>

      {/* Pista 2 (Duplicada para bucle infinito perfecto) */}
      <div className="flex min-w-full shrink-0 animate-marquee items-center justify-around">
        {items.map((item, i) => (
          <span
            key={`dup-${i}`}
            className="inline-flex items-center gap-2.5 px-[26px] font-serif text-[0.95rem] italic uppercase tracking-[0.02em]"
          >
            {item}
            <span aria-hidden="true">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;