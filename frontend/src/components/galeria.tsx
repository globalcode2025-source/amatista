import { useEffect, useMemo, useState } from 'react';
import type { GaleriaAdmin } from '../admin/types';
import { fetchGaleria, resolveMediaUrl } from '../services/galeria';

const SIZE_CLASSES = ['tall', 'normal', 'wide', 'normal', 'tall', 'normal', 'wide'] as const;

function getSize(index: number) {
  return SIZE_CLASSES[index % SIZE_CLASSES.length];
}

export function Galeria() {
  const [items, setItems] = useState<GaleriaAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void fetchGaleria()
      .then((data) => {
        if (active) setItems(data.slice(0, 7));
      })
      .catch(() => {
        if (active) setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const renderedItems = useMemo(() => items, [items]);

  return (
    <section id="galeria" className="bg-white py-[120px]">
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="mb-16 max-w-[640px]">
          <span className="font-hand text-[1.3rem] text-gold">Momentos, no solo productos</span>
          <h2 className="mt-2 font-serif text-[clamp(2.1rem,3.6vw,3rem)] font-semibold text-ink">Galería</h2>
          <p className="mt-4 leading-relaxed text-ink/68">
            Un vistazo detrás de cámaras: talleres, manos trabajando y los pequeños detalles que hacen a Amatista.
          </p>
        </div>

        {loading && <div className="rounded-sm border border-ink/10 bg-cream/40 px-4 py-3 text-sm text-ink/55">Cargando galería...</div>}

        <div className="grid grid-cols-2 auto-rows-[120px] gap-4 sm:grid-cols-3 md:auto-rows-[170px] lg:grid-cols-4">
          {renderedItems.map((item, index) => (
            <div
              key={item.id}
              className={`group relative flex cursor-pointer items-stretch justify-stretch overflow-hidden rounded-sm bg-[#3c2748] ${
                getSize(index) === 'tall' ? 'row-span-2' : ''
              } ${getSize(index) === 'wide' ? 'sm:col-span-2' : ''}`}
            >
              {item.tipo === 'Video' ? (
                <video
                  src={resolveMediaUrl(item.media)}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  muted
                  autoPlay
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={resolveMediaUrl(item.media)}
                  alt={item.titulo}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(29,16,36,0.02)_0%,rgba(29,16,36,0.08)_45%,rgba(29,16,36,0.72)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 z-[2] p-4 font-serif text-[0.92rem] text-white">
                {item.titulo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Galeria;