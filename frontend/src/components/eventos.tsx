import { useEffect, useState } from 'react';
import type { EventoAdmin } from '../admin/types';
import { fetchEventos, resolveEventoMediaUrl } from '../services/eventos';

const formatDate = (value: string) => new Intl.DateTimeFormat('es-CO', { weekday: 'short', day: '2-digit', month: 'short' }).format(new Date(`${value}T12:00:00`));
const formatTime = (value: string) => new Intl.DateTimeFormat('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(`1970-01-01T${value}`));
const formatPrice = (value: number) => `$ ${value.toLocaleString('es-CO')}`;

export function Eventos() {
  const [events, setEvents] = useState<EventoAdmin[]>([]);
  useEffect(() => { fetchEventos().then(setEvents).catch(() => setEvents([])); }, []);
  const publicEvents = events.filter((item) => item.estado === 'Próximo');

  if (publicEvents.length === 0) return null;

  return (
    <section id="eventos" className="relative bg-amatista-deep py-[120px] text-cream">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 85% 10%, rgba(190,155,94,0.12), transparent 60%)' }} />
      <div className="relative z-[1] mx-auto max-w-[1180px] px-8">
        {publicEvents.map((event) => {
          if (!event) return null;
          const includes = event.queTrae.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
          const dates = publicEvents.filter((item) => item.nombre === event.nombre);

          return (
            <div key={event.id} className="mb-16 last:mb-0 grid grid-cols-1 items-center gap-14 rounded-sm border border-cream/12 bg-cream/[0.04] p-8 md:grid-cols-[0.85fr_1.15fr] md:gap-16 md:p-[50px]">
              <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-sm bg-gradient-to-br from-[#7A5C94] to-[#362043]">
                {event.tipo === 'Video' ? <video src={resolveEventoMediaUrl(event.media)} controls playsInline className="h-full w-full object-cover" /> : <img src={resolveEventoMediaUrl(event.media)} alt={event.nombre} className="h-full w-full object-cover" />}
                <span className="absolute bottom-[18px] left-[18px] rounded-sm bg-gold px-4 py-2 text-[0.72rem] uppercase tracking-[0.05em] text-ink">{event.cuposDisponibles > 0 ? `${event.cuposDisponibles} cupos disponibles` : 'Cupos agotados'}</span>
              </div>
              <div>
                <span className="font-hand text-[1.3rem] text-gold">{event.frase}</span>
                <h2 className="mb-4 mt-2 font-serif text-[clamp(1.7rem,3vw,2.1rem)] font-semibold text-cream">{event.nombre}</h2>
                <p className="mb-6 max-w-[520px] leading-[1.75] text-cream/75">{event.descripcion}</p>
                {includes.length > 0 && <ul className="mb-7 grid grid-cols-1 gap-x-5 gap-y-[11px] sm:grid-cols-2">{includes.map((item) => <li key={item} className="flex items-start gap-2 text-[0.86rem] leading-tight text-cream/85"><span className="text-gold">✦</span>{item}</li>)}</ul>}
                <div className="mb-8 flex flex-wrap gap-3">{dates.map((item) => <div key={item.id} className="rounded-sm border border-gold-light/40 px-4 py-2.5 text-[0.8rem] text-gold-light"><strong className="block font-serif text-[0.94rem] capitalize text-cream">{formatDate(item.fecha)}</strong>{formatTime(item.hora)}</div>)}</div>
                <div className="flex flex-wrap items-center justify-between gap-[18px] border-t border-cream/15 pt-[26px]"><div className="font-serif text-[1.7rem] text-cream">{formatPrice(event.precio)}<span className="block font-sans text-[0.76rem] uppercase tracking-[0.04em] text-cream/55">Por persona · {event.duracion >= 60 ? `${event.duracion / 60} horas` : `${event.duracion} minutos`} · {event.ubicacion}</span></div><a href={`https://wa.me/573147325051?text=${encodeURIComponent(`Hola, quiero reservar mi cupo para ${event.nombre}`)}`} target="_blank" rel="noopener noreferrer" className="inline-block rounded-sm bg-gold px-8 py-4 text-sm uppercase tracking-wider text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light">Reservar mi cupo</a></div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Eventos;
