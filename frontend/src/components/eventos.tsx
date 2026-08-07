export interface EventoDate {
  label: string;
  time: string;
}

export interface EventosProps {
  dates?: EventoDate[];
  price?: string;
  priceNote?: string;
  whatsappHref?: string;
}

const DEFAULT_DATES: EventoDate[] = [
  { label: 'Dom 09 Agosto', time: '2:30 PM' },
  { label: 'Dom 10 Oct', time: '2:30 PM' },
  { label: 'Dom 14 Nov', time: '2:30 PM' },
];

const INCLUDES = [
  'Pieza de cerámica para intervenir',
  'Materiales de dorado incluidos',
  'Guía y acompañamiento personalizado',
  'Refrigerio y aromaterapia',
];

export function Eventos({
  dates = DEFAULT_DATES,
  price = '$ 80.000',
  priceNote = 'Por persona · 3 horas',
  whatsappHref = 'https://wa.me/573000000000?text=Hola%2C%20quiero%20reservar%20mi%20cupo%20para%20el%20Taller%20de%20Kintsugi',
}: EventosProps) {
  return (
    <section id="eventos" className="relative bg-amatista-deep py-[120px] text-cream">
      {/* resplandor decorativo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 85% 10%, rgba(190,155,94,0.12), transparent 60%)',
        }}
      />

      <div className="relative z-[1] mx-auto max-w-[1180px] px-8">
        <div className="mb-16 max-w-[640px]">
          <span className="font-hand text-[1.3rem] text-gold">Un espacio para reconectar y sanar</span>
          <h2 className="mt-2 font-serif text-[clamp(2.1rem,3.6vw,3rem)] font-semibold text-cream">
            El Taller de Kintsugi
          </h2>
          <p className="mt-4 leading-relaxed text-cream/72">
            Nuestro único encuentro presencial — y el corazón de Amatista. Cupos limitados, en El Retiro, Antioquia.
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-14 rounded-sm border border-cream/12 bg-cream/[0.04] p-8 md:grid-cols-[0.85fr_1.15fr] md:gap-16 md:p-[50px]">
          {/* Visual */}
          <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-sm bg-gradient-to-br from-[#7A5C94] to-[#362043] md:aspect-[4/5]">
            <svg viewBox="0 0 100 100" fill="none" stroke="#F4EEE3" strokeWidth="1.6" className="w-[46%]">
              <path d="M50 78C30 62 20 48 20 34a14 14 0 0 1 27-6 14 14 0 0 1 27 6c0 14-10 28-24 44Z" />
              <path d="M38 44l9 9-7 8 9 11" stroke="#E4C892" strokeWidth="1.4" />
            </svg>
            <span className="absolute bottom-[18px] left-[18px] rounded-sm bg-gold px-4 py-2 text-[0.72rem] uppercase tracking-[0.05em] text-ink">
              Cupos limitados
            </span>
          </div>

          {/* Detalles */}
          <div>
            <span className="font-hand text-[1.3rem] text-gold">Honra tus cicatrices</span>
            <h3 className="mb-4 mt-2 font-serif text-[clamp(1.7rem,3vw,2.1rem)] font-semibold text-cream">
              Taller de Kintsugi
            </h3>
            <p className="mb-6 max-w-[520px] leading-[1.75] text-cream/75">
              Encuentra la belleza en la resiliencia. Interviene tu propia pieza de cerámica con la técnica japonesa
              del oro — un ritual de tres horas para transformar lo roto en algo más valioso de lo que era antes.
            </p>

            <ul className="mb-7 grid grid-cols-1 gap-x-5 gap-y-[11px] sm:grid-cols-2">
              {INCLUDES.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[0.86rem] leading-tight text-cream/85">
                  <span className="text-gold">✦</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mb-8 flex flex-wrap gap-3">
              {dates.map((d) => (
                <div key={d.label} className="rounded-sm border border-gold-light/40 px-4 py-2.5 text-[0.8rem] text-gold-light">
                  <strong className="block font-serif text-[0.94rem] text-cream">{d.label}</strong>
                  {d.time}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-[18px] border-t border-cream/15 pt-[26px]">
              <div className="font-serif text-[1.7rem] text-cream">
                {price}
                <span className="block font-sans text-[0.76rem] uppercase tracking-[0.04em] text-cream/55">
                  {priceNote}
                </span>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-sm bg-gold px-8 py-4 text-sm uppercase tracking-wider text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light"
              >
                Reservar mi cupo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Eventos;