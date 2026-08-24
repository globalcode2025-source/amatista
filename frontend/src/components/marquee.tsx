export interface MarqueeProps {
  items?: string[];
  speedSeconds?: number; // más alto = más lento
}

const DEFAULT_ITEMS = [
  'Velas artesanales',
  'Wax melts',
  'Taller de Kintsugi',
  'El Retiro, Antioquia',
  'Envíos a toda Colombia',
];

export function Marquee({ items = DEFAULT_ITEMS, speedSeconds = 40 }: MarqueeProps) {
  const track = [...items, ...items]; // duplicado UNA vez, en el mismo track

  return (
    <div className="marquee-wrap relative z-[3] overflow-hidden whitespace-nowrap bg-gold py-[13px] text-ink select-none">
      <div className="marquee-track flex w-max items-center" style={{ ['--marquee-duration' as string]: `${speedSeconds}s` }}>
        {track.map((item, i) => (
          <span
            key={i}
            className="inline-flex shrink-0 items-center gap-4 px-8 font-serif text-[0.95rem] italic uppercase tracking-[0.02em]"
          >
            {item}
            <span aria-hidden="true" className="mx-2">·</span>
          </span>
        ))}
      </div>

      <style>{`
        .marquee-track {
          animation: marquee-scroll var(--marquee-duration, 40s) linear infinite;
        }
        .marquee-wrap:hover .marquee-track {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
}

export default Marquee;