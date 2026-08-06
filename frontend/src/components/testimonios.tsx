import { useEffect, useRef, useState } from 'react';

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatarBg: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'El taller de kintsugi fue el regalo más honesto que me he dado. Llegué a arreglar cerámica y salí entendiendo mis propias grietas distinto.',
    name: 'María Camila R.',
    role: 'Taller de Kintsugi',
    avatarBg: 'bg-amatista-mid',
    initials: 'MC',
  },
  {
    quote: 'Pedí el Kit Ritual de Sanación para mi mamá y terminé comprando uno para mí. El aroma se queda en la casa por semanas.',
    name: 'Daniela L.',
    role: 'Kit Ritual de Sanación',
    avatarBg: 'bg-gold',
    initials: 'DL',
  },
  {
    quote: 'Se nota el cuidado en cada detalle, desde el empaque hasta la nota escrita a mano. Ya es mi regalo de cumpleaños de siempre.',
    name: 'Sofía B.',
    role: 'Vela Ojo Protector',
    avatarBg: 'bg-amatista-deep',
    initials: 'SB',
  },
  {
    quote: 'Fui sola al Círculo Sanar sin saber qué esperar y salí con cinco nuevas amigas y muchísima más calma.',
    name: 'Karen R.',
    role: 'Círculo Sanar en Comunidad',
    avatarBg: 'bg-amatista-mid',
    initials: 'KR',
  },
];

export function Testimonios() {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    itemRefs.current[active]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }, [active]);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    let nearest = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, idx) => {
      const distance = Math.abs(card.offsetLeft - el.scrollLeft);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearest = idx;
      }
    });

    setActive(nearest);
  };

  return (
    <section id="testimonios" className="py-[120px]">
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="mb-16 max-w-[640px]">
          <span className="font-hand text-[1.3rem] text-gold">Voces de nuestra comunidad</span>
          <h2 className="mt-2 font-serif text-[clamp(2.1rem,3.6vw,3rem)] font-semibold text-ink">Testimonios</h2>
          <p className="mt-4 leading-relaxed text-ink/68">
            Lo que dicen quienes ya encendieron una vela, o una parte de sí mismas, con nosotros.
          </p>
        </div>

        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory gap-[26px] overflow-x-auto pb-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TESTIMONIALS.map((t, index) => (
            <div
              key={t.name}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              className="flex min-w-[340px] max-w-[340px] shrink-0 snap-start flex-col gap-[18px] rounded-sm border border-ink/8 bg-white px-[30px] py-[34px]"
            >
              <span className="font-serif text-[3rem] italic leading-[0.5] text-gold">“</span>
              <p className="text-base leading-[1.65] text-ink">{t.quote}</p>
              <div className="mt-auto flex items-center gap-3">
                <div
                  className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full font-serif text-[0.95rem] text-white ${t.avatarBg}`}
                >
                  {t.initials}
                </div>
                <div>
                  <strong className="block text-[0.92rem] font-medium text-ink">{t.name}</strong>
                  <span className="text-[0.78rem] text-ink/55">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[34px] flex justify-center gap-2">
          {TESTIMONIALS.map((t, i) => (
            <span
              key={t.name}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${i === active ? 'bg-gold' : 'bg-ink/22'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonios;