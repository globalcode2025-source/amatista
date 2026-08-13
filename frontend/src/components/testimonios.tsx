import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import type { TestimonioAdmin } from '../admin/types';
import { createTestimonio, fetchTestimoniosPublicos } from '../services/testimonios';
import { Modal } from './Modal';

interface TestimonialFormData {
  name: string;
  type: string;
  quote: string;
}

const FORM_DEFAULTS: TestimonialFormData = { name: '', type: '', quote: '' };
const AVATAR_CLASSES = ['bg-amatista-mid', 'bg-gold', 'bg-amatista-deep', 'bg-amatista-mid'] as const;
const TIPOS = ['Producto', 'Servicio al cliente', 'Taller'];

function makeInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('').slice(0, 2) || 'TU';
}

export function Testimonios() {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [items, setItems] = useState<TestimonioAdmin[]>([]);
  const [active, setActive] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<TestimonialFormData>(FORM_DEFAULTS);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchTestimoniosPublicos().then(setItems).catch(() => setItems([]));
  }, []);

  const renderedTestimonials = useMemo(() => items, [items]);

  useEffect(() => {
    if (renderedTestimonials.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % renderedTestimonials.length), 5000);
    return () => window.clearInterval(timer);
  }, [renderedTestimonials.length]);

  useEffect(() => {
    itemRefs.current[active]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }, [active, renderedTestimonials.length]);

  useEffect(() => {
    if (active >= renderedTestimonials.length && renderedTestimonials.length > 0) setActive(0);
  }, [active, renderedTestimonials.length]);

  const handleScroll = () => {
    const element = trackRef.current;
    if (!element) return;
    const cards = Array.from(element.children) as HTMLElement[];
    let nearest = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - element.scrollLeft);
      if (distance < smallestDistance) { smallestDistance = distance; nearest = index; }
    });
    setActive(nearest);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await createTestimonio({ nombre: formData.name.trim(), tipo: formData.type, descripcion: formData.quote.trim() });
      setFormData(FORM_DEFAULTS);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el testimonio.');
    }
  };

  const closeModal = () => { setModalOpen(false); setSubmitted(false); setError(''); };

  return (
    <section id="testimonios" className="py-[120px]">
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[640px]">
            <span className="font-hand text-[1.3rem] text-gold">Voces de nuestra comunidad</span>
            <h2 className="mt-2 font-serif text-[clamp(2.1rem,3.6vw,3rem)] font-semibold text-ink">Testimonios</h2>
            <p className="mt-4 leading-relaxed text-ink/68">Lo que dicen quienes ya encendieron una vela, o una parte de sí mismas, con nosotros.</p>
          </div>
          <button type="button" onClick={() => setModalOpen(true)} className="rounded-sm border border-amatista-deep px-5 py-3 text-sm uppercase tracking-wider text-amatista-deep transition-colors hover:bg-amatista-deep hover:text-cream">Dejar testimonio</button>
        </div>

        {renderedTestimonials.length > 0 && <>
          <div ref={trackRef} onScroll={handleScroll} className="flex snap-x snap-mandatory gap-[26px] overflow-x-auto pb-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {renderedTestimonials.map((testimonial, index) => (
              <div key={testimonial.id} ref={(node) => { itemRefs.current[index] = node; }} className="flex min-w-[340px] max-w-[340px] shrink-0 snap-start flex-col gap-[18px] rounded-sm border border-ink/8 bg-white px-[30px] py-[34px]">
                <span className="font-serif text-[3rem] italic leading-[0.5] text-gold">“</span>
                <p className="text-base leading-[1.65] text-ink">{testimonial.descripcion}</p>
                <div className="mt-auto flex items-center gap-3">
                  <div className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full font-serif text-[0.95rem] text-white ${AVATAR_CLASSES[index % AVATAR_CLASSES.length]}`}>{makeInitials(testimonial.nombre)}</div>
                  <div><strong className="block text-[0.92rem] font-medium text-ink">{testimonial.nombre}</strong><span className="text-[0.78rem] text-ink/55">{testimonial.tipo}</span></div>
                </div>
              </div>
            ))}
          </div>
          {renderedTestimonials.length > 1 && <div className="mt-[34px] flex justify-center gap-2">{renderedTestimonials.map((testimonial, index) => <span key={testimonial.id} className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${index === active ? 'bg-gold' : 'bg-ink/22'}`} />)}</div>}
        </>}
      </div>

      <Modal open={modalOpen} title="Dejar testimonio" onClose={closeModal}>
        {submitted ? <div className="space-y-5 text-center"><p className="font-serif text-xl text-ink">¡Gracias por compartir tu experiencia!</p><p className="text-sm leading-relaxed text-ink/65">Tu testimonio fue enviado y se publicará cuando sea aprobado.</p><button type="button" onClick={closeModal} className="rounded-sm bg-gold px-6 py-2.5 text-sm text-ink">Cerrar</button></div> : <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="block"><span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">Nombre</span><input type="text" required value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-sm border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-gold focus:outline-none" placeholder="Tu nombre" /></label>
          <label className="block"><span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">Tipo</span><select required value={formData.type} onChange={(event) => setFormData((current) => ({ ...current, type: event.target.value }))} className="w-full rounded-sm border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"><option value="" disabled>Selecciona una opción</option>{TIPOS.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
          <label className="block"><span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">Descripción</span><textarea required value={formData.quote} onChange={(event) => setFormData((current) => ({ ...current, quote: event.target.value }))} className="min-h-[120px] w-full rounded-sm border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-gold focus:outline-none" placeholder="Cuéntanos tu experiencia" /></label>
          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="mt-2 flex justify-end gap-3"><button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm text-ink/60 hover:text-ink">Cancelar</button><button type="submit" className="rounded-sm bg-gold px-6 py-2.5 text-sm text-ink hover:bg-gold-light">Enviar</button></div>
        </form>}
      </Modal>
    </section>
  );
}

export default Testimonios;
