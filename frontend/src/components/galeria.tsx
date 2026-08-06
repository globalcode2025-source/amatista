export interface GalleryItem {
  caption: string;
  gradient: string;
  icon: string;
  size?: 'normal' | 'tall' | 'wide';
}

const ITEMS: GalleryItem[] = [
  {
    caption: 'Taller de Kintsugi al aire libre',
    gradient: 'from-[#7A5C94] to-[#362043]',
    icon: '<path d="M20 60c8-18 20-30 30-30s22 12 30 30" /><circle cx="50" cy="30" r="8"/>',
    size: 'tall',
  },
  {
    caption: 'Dorando una pieza intervenida',
    gradient: 'from-[#BE9B5E] to-[#8f7245]',
    icon: '<path d="M30 50l14 14 26-30" />',
  },
  {
    caption: 'Mesa de bienestar y velas encendidas',
    gradient: 'from-[#3c2748] to-[#5b3f70]',
    icon: '<path d="M35 20c3 6 7 8 7 13a7 7 0 1 1-14 0c0-5 4-7 7-13Z"/><path d="M65 20c3 6 7 8 7 13a7 7 0 1 1-14 0c0-5 4-7 7-13Z"/>',
    size: 'wide',
  },
  {
    caption: 'Empaques listos para envío',
    gradient: 'from-[#9c85b1] to-[#7A5C94]',
    icon: '<rect x="26" y="26" width="48" height="48" rx="4"/>',
  },
  {
    caption: 'Piedra amatista natural',
    gradient: 'from-[#362043] to-[#241825]',
    icon: '<path d="M50 78C30 62 20 48 20 34a14 14 0 0 1 27-6 14 14 0 0 1 27 6c0 14-10 28-24 44Z"/>',
    size: 'tall',
  },
  {
    caption: 'Comunidad reunida en el taller',
    gradient: 'from-[#8f7245] to-[#BE9B5E]',
    icon: '<circle cx="50" cy="42" r="16"/><path d="M30 78c2-12 9-18 20-18s18 6 20 18"/>',
  },
  {
    caption: 'Aromas de origen, siempre botánicos',
    gradient: 'from-[#5b3f70] to-[#9c85b1]',
    icon: '<path d="M50 20v55M50 20l-16 8M50 20l16 8" /><ellipse cx="50" cy="78" rx="16" ry="5"/>',
    size: 'wide',
  },
];

const SIZE_CLASSES: Record<NonNullable<GalleryItem['size']>, string> = {
  normal: '',
  tall: 'row-span-2',
  wide: 'col-span-2',
};

export function Galeria() {
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

        <div className="grid grid-cols-2 auto-rows-[120px] gap-4 sm:grid-cols-3 md:auto-rows-[170px] lg:grid-cols-4">
          {ITEMS.map((item) => (
            <div
              key={item.caption}
              className={`group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-sm bg-gradient-to-br ${item.gradient} ${
                item.size ? SIZE_CLASSES[item.size] : ''
              } ${item.size === 'wide' ? 'sm:col-span-2' : ''}`}
            >
              <svg
                viewBox="0 0 100 100"
                fill="none"
                stroke="#F4EEE3"
                strokeWidth="1.6"
                className="relative z-[1] w-[30%] transition-transform duration-500 group-hover:scale-[1.12]"
                dangerouslySetInnerHTML={{ __html: item.icon }}
              />
              <div
                className="absolute inset-x-0 bottom-0 z-[2] translate-y-2 p-4 font-serif text-[0.82rem] text-white opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100"
                style={{ background: 'linear-gradient(0deg, rgba(20,12,20,0.7), transparent 70%)' }}
              >
                {item.caption}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Galeria;