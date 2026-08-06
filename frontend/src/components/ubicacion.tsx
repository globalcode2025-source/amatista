export function Ubicacion() {
  return (
    <section id="ubicacion" className="bg-cream py-[120px]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-9 px-8 md:grid-cols-2 md:gap-[60px]">
        <div>
          <span className="font-hand text-[1.3rem] text-gold">Visítanos</span>
          <h2 className="mt-2 font-serif text-[clamp(2rem,3.4vw,2.8rem)] font-semibold text-ink">
            Nuestro rincón en La Ceja
          </h2>
          <p className="mt-4 leading-[1.7] text-ink/68">
            Ubicados en La Ceja, Antioquia — tierra de flores y artesanía. Aquí realizamos el Taller de Kintsugi y
            puedes recoger tu pedido si lo prefieres.
          </p>

          <ul className="my-[26px] flex flex-col gap-[18px]">
            <li className="flex items-start gap-3.5 text-[0.95rem] leading-snug text-ink/75">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mt-0.5 h-5 w-5 shrink-0 text-gold">
                <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
                <circle cx="12" cy="9.5" r="2.4" />
              </svg>
              <div>
                <strong className="block font-serif font-semibold text-ink">Dónde estamos</strong>
                La Ceja, Antioquia, Colombia. Dirección exacta al confirmar tu cupo.
              </div>
            </li>
            <li className="flex items-start gap-3.5 text-[0.95rem] leading-snug text-ink/75">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mt-0.5 h-5 w-5 shrink-0 text-gold">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3.5 2" />
              </svg>
              <div>
                <strong className="block font-serif font-semibold text-ink">Horario de atención</strong>
                Miércoles a sábado, 10:00 a.m. – 6:00 p.m. (con cita previa)
              </div>
            </li>
            <li className="flex items-start gap-3.5 text-[0.95rem] leading-snug text-ink/75">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mt-0.5 h-5 w-5 shrink-0 text-gold">
                <rect x="3" y="10" width="18" height="9" rx="2" />
                <path d="M7 10V7a5 5 0 0 1 10 0v3" />
              </svg>
              <div>
                <strong className="block font-serif font-semibold text-ink">Cómo llegar</strong>
                A 45 min de Medellín por la vía a Rionegro–La Ceja. Parqueadero cercano disponible.
              </div>
            </li>
          </ul>

          <a
            href="https://www.google.com/maps/search/?api=1&query=La+Ceja+Antioquia+Colombia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-sm border border-amatista-deep px-8 py-4 text-sm uppercase tracking-wider text-amatista-deep transition-all duration-300 hover:border-gold hover:bg-gold hover:text-ink"
          >
            Cómo llegar →
          </a>
        </div>

        <div className="aspect-[4/3] overflow-hidden rounded-sm border border-ink/14 shadow-[0_24px_50px_-28px_rgba(54,32,67,0.35)]">
          <iframe
            src="https://www.google.com/maps?q=La+Ceja,+Antioquia,+Colombia&output=embed"
            loading="lazy"
            title="Mapa Amatista - La Ceja, Antioquia"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full grayscale-[15%] contrast-[1.02]"
          />
        </div>
      </div>
    </section>
  );
}

export default Ubicacion;