import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export interface NavLinkItem {
  label: string;
  href: string;
  /** true = navegación de router (cambia de página), false = ancla en la misma página */
  isRoute?: boolean;
}

export interface NavProps {
  links?: NavLinkItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

const DEFAULT_LINKS: NavLinkItem[] = [
  { label: 'Inicio', href: '/#inicio' },
  { label: 'Productos', href: '/catalogo', isRoute: true },
  { label: 'Eventos', href: '/#eventos' },
  { label: 'Galería', href: '/#galeria' },
  { label: 'Historia', href: '/#historia' },
  { label: 'Ubicación', href: '/#ubicacion' },
];

export function Nav({ links = DEFAULT_LINKS, ctaLabel = 'Reservar taller', ctaHref = '/#eventos' }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const textColor = scrolled ? 'text-amatista-deep' : 'text-cream';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[200] transition-all duration-500 ${
        scrolled ? 'bg-cream/95 py-3 shadow-[0_1px_0_rgba(36,24,37,0.06)] backdrop-blur-md' : 'bg-transparent py-[22px]'
      }`}
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-8">
        {/* Marca */}
        <Link
          to="/login"
          className={`inline-flex items-center font-serif text-[1.35rem] font-semibold tracking-[0.04em] opacity-90 transition-opacity duration-300 hover:opacity-100 focus-visible:outline-none ${textColor}`}
        >
          <span className="whitespace-nowrap">Amatista</span>
        </Link>

        {/* Links desktop */}
        <ul className="hidden gap-[34px] md:flex">
          {links.map((link) => (
            <li key={link.label}>
              {link.isRoute ? (
                <Link
                  to={link.href}
                  className={`group relative text-[0.86rem] uppercase tracking-[0.06em] opacity-85 transition-colors duration-500 hover:opacity-100 ${textColor}`}
                >
                  {link.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              ) : (
                <Link
                  to={link.href}
                  onClick={() => {
                    // Forzar scroll al inicio al hacer click en Inicio
                    if (link.href === '/#inicio') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`group relative text-[0.86rem] uppercase tracking-[0.06em] opacity-85 transition-colors duration-500 hover:opacity-100 ${textColor}`}
                >
                  {link.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* CTA desktop */}
        <Link
          to={ctaHref}
          className={`hidden rounded-sm border px-[22px] py-2.5 text-[0.82rem] uppercase tracking-[0.05em] transition-all duration-300 hover:bg-gold hover:text-ink md:inline-block ${
            scrolled ? 'border-amatista-deep text-amatista-deep hover:border-gold' : 'border-gold text-cream hover:border-gold'
          }`}
        >
          {ctaLabel}
        </Link>

        {/* Botón hamburguesa (móvil) */}
        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex flex-col gap-[5px] md:hidden"
        >
          <span className={`h-[1.5px] w-6 transition-colors duration-500 ${scrolled ? 'bg-amatista-deep' : 'bg-cream'}`} />
          <span className={`h-[1.5px] w-6 transition-colors duration-500 ${scrolled ? 'bg-amatista-deep' : 'bg-cream'}`} />
          <span className={`h-[1.5px] w-6 transition-colors duration-500 ${scrolled ? 'bg-amatista-deep' : 'bg-cream'}`} />
        </button>
      </div>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <ul className="flex flex-col gap-[18px] bg-cream px-8 py-6 md:hidden">
          {links.map((link) =>
            link.isRoute ? (
              <li key={link.label}>
                <Link to={link.href} onClick={() => setMenuOpen(false)} className="text-amatista-deep">
                  {link.label}
                </Link>
              </li>
            ) : (
              <li key={link.label}>
                <Link to={link.href} onClick={() => setMenuOpen(false)} className="text-amatista-deep">
                  {link.label}
                </Link>
              </li>
            ),
          )}
          <li>
            <Link to={ctaHref} onClick={() => setMenuOpen(false)} className="font-medium text-gold">
              {ctaLabel}
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}

export default Nav;
