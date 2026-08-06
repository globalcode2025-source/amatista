export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroProps {
  /** Ciudad mostrada en el badge superior */
  location?: string;
  /** Año o texto de "desde" en el badge */
  since?: string;
  /** Texto del titular antes de la palabra resaltada */
  titlePrefix?: string;
  /** Palabra final del titular que se resalta en dorado/cursiva */
  highlightWord?: string;
  /** Párrafo de introducción bajo el titular */
  lead?: string;
  /** Link del botón principal (dorado) */
  exploreHref?: string;
  /** Link del botón secundario (outline) */
  reserveHref?: string;
  /** Estadísticas de la barra inferior del hero */
  stats?: HeroStat[];
}

const DEFAULT_STATS: HeroStat[] = [
  { value: '130+', label: 'Almas en comunidad' },
  { value: '100%', label: 'Hecho a mano' },
  { value: '32', label: 'Departamentos con envío' },
];

const PARTICLES = [
  { left: '12%', delay: '0s', size: 4 },
  { left: '26%', delay: '1.8s', size: 3 },
  { left: '44%', delay: '3.4s', size: 4 },
  { left: '61%', delay: '0.9s', size: 3 },
  { left: '78%', delay: '4.6s', size: 4 },
  { left: '90%', delay: '2.6s', size: 3 },
];

const BTN_BASE =
  'inline-block rounded-sm px-8 py-4 text-sm uppercase tracking-wider transition-all duration-300';
const BTN_GOLD = 'bg-gold text-ink hover:bg-gold-light hover:-translate-y-0.5';
const BTN_OUTLINE = 'border border-cream/50 text-cream hover:border-gold hover:text-gold-light';

export function Hero({
  location = 'La Ceja, Antioquia',
  since = 'Desde 2026',
  titlePrefix = 'Enciende lo que te',
  highlightWord = 'sana',
  lead = 'Velas artesanales hechas a mano, aromas de origen y experiencias kintsugi para honrar tus cicatrices y encontrar belleza en la resiliencia.',
  exploreHref = '/catalogo',
  reserveHref = '/#eventos',
  stats = DEFAULT_STATS,
}: HeroProps) {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-0 pt-[130px] text-center bg-[radial-gradient(ellipse_65%_55%_at_50%_0%,rgba(122,92,148,0.4),transparent_65%),linear-gradient(180deg,#362043_0%,#2a1735_55%,#241825_100%)] lg:pt-[150px]"
    >
      {/* textura de grano sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* cristal de amatista decorativo de fondo */}
      <svg
        aria-hidden="true"
        viewBox="0 0 600 520"
        fill="none"
        className="pointer-events-none absolute left-1/2 top-[50%] z-0 w-[min(620px,96vw)] -translate-x-1/2 -translate-y-1/2 opacity-[0.16] animate-geode-breathe"
      >
        <polygon points="300,18 336,294 264,294" fill="#7A5C94" opacity=".55" />
        <polygon points="220,58 260,312 178,294" fill="#9C85B1" opacity=".42" />
        <polygon points="380,58 422,312 340,294" fill="#9C85B1" opacity=".42" />
        <polygon points="150,120 198,328 128,304" fill="#7A5C94" opacity=".34" />
        <polygon points="450,120 498,304 402,328" fill="#7A5C94" opacity=".34" />
        <polygon points="92,184 144,340 72,316" fill="#5b3f70" opacity=".26" />
        <polygon points="508,184 560,316 456,340" fill="#5b3f70" opacity=".26" />
        <g stroke="#E4C892" strokeWidth="1" opacity=".6">
          <polygon points="300,18 336,294 264,294" />
          <polygon points="220,58 260,312 178,294" />
          <polygon points="380,58 422,312 340,294" />
          <polygon points="150,120 198,328 128,304" />
          <polygon points="450,120 498,304 402,328" />
        </g>
        <ellipse cx="300" cy="332" rx="240" ry="24" fill="#241825" opacity=".5" />
      </svg>

      {/* partículas doradas flotando */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute bottom-[-10px] rounded-full bg-gold-light opacity-0 animate-drift-up"
            style={{ left: p.left, animationDelay: p.delay, width: p.size, height: p.size }}
          />
        ))}
      </div>

      <div className="relative z-[2] flex w-full flex-col items-center">
        <span className="mb-7 inline-flex items-center gap-[9px] rounded-full border border-gold-light/35 py-2 pl-3.5 pr-5 text-[0.74rem] uppercase tracking-[0.07em] text-gold-light">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-3.5 w-3.5 shrink-0">
            <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
            <circle cx="12" cy="9.5" r="2.4" />
          </svg>
          {location}
          <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-gold" />
          {since}
        </span>

        <h1 className="mx-auto mb-6 max-w-[15ch] text-balance font-serif text-[clamp(2.25rem,6.5vw,5rem)] font-semibold leading-[1.05] tracking-tight text-cream">
          {titlePrefix} <em className="italic text-gold-light">{highlightWord}</em>.
        </h1>

        <p className="mx-auto mb-10 max-w-[480px] text-[1.05rem] leading-[1.7] text-cream/80">{lead}</p>

        <div className="mb-16 flex flex-wrap justify-center gap-4">
          <a href={exploreHref} className={`${BTN_BASE} ${BTN_GOLD}`}>
            Ver colección
          </a>
          <a href={reserveHref} className={`${BTN_BASE} ${BTN_OUTLINE}`}>
            Reservar el taller
          </a>
        </div>

        <div className="relative z-[2] flex w-full max-w-[760px] flex-wrap justify-center border-t border-cream/15">
          {stats.map((stat) => (
            <div key={stat.label} className="flex-1 basis-[200px] border-r border-cream/15 px-5 py-6 text-center last:border-r-0">
              <strong className="mb-0.5 block font-serif text-[1.4rem] text-gold-light">{stat.value}</strong>
              <span className="text-[0.72rem] uppercase tracking-[0.06em] text-cream/60">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2 text-[0.7rem] uppercase tracking-[0.15em] text-cream/60">
        <span className="h-[30px] w-px animate-scroll-down bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}

export default Hero;