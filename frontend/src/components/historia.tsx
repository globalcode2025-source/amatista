export interface TimelineItem {
  year: string;
  title: string;
  desc: string;
}

const TIMELINE: TimelineItem[] = [
  { year: '2023', title: 'Nace Amatista', desc: 'Desde un rincón de casa, con las primeras velas vertidas a mano.' },
  { year: '2024', title: 'Primeros talleres', desc: 'Abrimos las puertas a encuentros de vela artesanal en comunidad.' },
  {
    year: '2025',
    title: 'Nace la experiencia Kintsugi',
    desc: 'El arte japonés del oro se une a nuestros rituales de sanación.',
  },
  { year: '2026', title: 'Más de 130 almas', desc: 'Una comunidad que crece encendiendo intención, un aroma a la vez.' },
];

export function Historia() {
  return (
    <section id="historia" className="bg-white py-[120px]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-11 px-8 md:grid-cols-[0.85fr_1.15fr] md:gap-[70px]">
        {/* Nota manuscrita + timeline */}
        <div>
          <div className="relative -rotate-[1.4deg] border border-gold/35 bg-cream px-7 py-[30px] shadow-[0_18px_40px_-20px_rgba(54,32,67,0.3)]">
            <span className="absolute -top-[11px] left-7 h-[22px] w-[22px] rounded-full bg-gold shadow-[0_3px_8px_rgba(0,0,0,0.25)]" />
            <p className="font-hand text-[1.5rem] leading-[1.5] text-amatista-deep">
              "No sabía por dónde empezar. Elegí un nombre, me acomodé en un rincón de mi casa, organicé todo con
              amor... y sobre todo, confié en mí."
            </p>
          </div>

          <div className="mt-11 flex flex-col">
            {TIMELINE.map((item, i) => (
              <div
                key={item.year}
                className={`grid grid-cols-[70px_1fr] gap-5 border-t border-ink/10 py-5 ${
                  i === TIMELINE.length - 1 ? 'border-b' : ''
                }`}
              >
                <span className="font-serif text-xl font-semibold text-gold">{item.year}</span>
                <div>
                  <h4 className="mb-1 text-[1.05rem] font-medium text-ink">{item.title}</h4>
                  <p className="text-sm leading-relaxed text-ink/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copy */}
        <div>
          <span className="mb-1 block font-hand text-[1.3rem] text-gold">Cómo comenzó todo</span>
          <h2 className="mb-[22px] font-serif text-[clamp(2rem,3.4vw,2.8rem)] font-semibold text-ink">
            Una idea, un rincón de casa y mucha fe
          </h2>
          <p className="mb-[18px] leading-[1.75] text-ink/72">
            Amatista nació sin fórmula ni plan de negocio — nació de la necesidad de crear algo con las manos que
            ayudara a sanar. La primera vela se vertió en una mesa de cocina; la primera publicación se hizo con
            miedo, y la primera venta, con el corazón acelerado.
          </p>
          <p className="mb-[18px] leading-[1.75] text-ink/72">
            Hoy seguimos haciendo cada pieza igual que el primer día: en lotes pequeños, con aromas que elegimos
            probando en casa, y con la certeza de que un objeto hecho con intención puede acompañar a alguien en su
            propio proceso.
          </p>
          <p className="mb-[18px] leading-[1.75] text-ink/72">
            El nombre no es casualidad. La amatista es la piedra de la calma y la claridad — justo lo que queremos
            que sientas cuando enciendes una de nuestras velas.
          </p>
          <a
            href="#eventos"
            className="mt-2.5 inline-block rounded-sm border border-amatista-deep px-8 py-4 text-sm uppercase tracking-wider text-amatista-deep transition-all duration-300 hover:border-gold hover:bg-gold hover:text-ink"
          >
            Conoce sobre nosotros
          </a>
        </div>
      </div>
    </section>
  );
}

export default Historia;