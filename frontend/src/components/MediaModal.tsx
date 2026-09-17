import type { GaleriaAdmin } from '../admin/types';
import { resolveMediaUrl } from '../services/galeria';

interface MediaModalProps {
  open: boolean;
  item: GaleriaAdmin | null;
  onClose: () => void;
}

export function MediaModal({ open, item, onClose }: MediaModalProps) {
  if (!open || !item) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-[rgba(29,16,36,0.85)] p-4 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-[800px] overflow-hidden rounded-sm bg-white shadow-2xl transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink/60 shadow-lg transition-all hover:bg-white hover:text-ink hover:scale-110"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Media content */}
        <div className="relative aspect-video w-full bg-[#1d1024]">
          {item.tipo === 'Video' ? (
            <video
              src={resolveMediaUrl(item.media)}
              className="h-full w-full object-contain"
              controls
              autoPlay
              onError={(e) => {
                (e.target as HTMLVideoElement).poster = 'https://via.placeholder.com/800x450/3c2748/f5f0e8?text=Video+no+disponible';
              }}
            />
          ) : (
            <img
              src={resolveMediaUrl(item.media)}
              alt={item.titulo}
              className="h-full w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450/3c2748/f5f0e8?text=Imagen+no+disponible';
              }}
            />
          )}
        </div>

        {/* Content section */}
        <div className="bg-gradient-to-b from-cream to-white p-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20">
              {item.tipo === 'Video' ? (
                <svg className="h-4 w-4 text-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-gold" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium text-gold/80 uppercase tracking-wider">
              {item.tipo}
            </span>
          </div>

          <h3 className="mb-4 font-serif text-2xl font-semibold text-ink">{item.titulo}</h3>
          
          {item.descripcion && (
            <p className="leading-relaxed text-ink/70">{item.descripcion}</p>
          )}

          {/* Decorative elements */}
          <div className="mt-6 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-gold/0 via-gold/40 to-gold/0" />
            <div className="h-2 w-2 rounded-full bg-gold/60" />
            <div className="h-px flex-1 bg-gradient-to-r from-gold/0 via-gold/40 to-gold/0" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaModal;
