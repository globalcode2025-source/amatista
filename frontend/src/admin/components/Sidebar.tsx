import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ICONS: Record<string, string> = {
  grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  box: '<path d="M3 8l9-5 9 5-9 5-9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M15 14.2c2.5.4 4.3 2.3 4.7 4.8"/>',
  candle: '<path d="M12 3c1.6 2 3 3.4 3 5a3 3 0 1 1-6 0c0-1.6 1.4-3 3-5Z"/><path d="M7 10h10v6a5 5 0 0 1-10 0v-6Z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  down: '<path d="M3 7l6 6 4-4 8 8"/><path d="M15 17h6v-6"/>',
  tag: '<path d="M20 12l-8 8-9-9V3h8l9 9Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
  commercial: '<path d="M3 3h18v18H3zM7 7h10M7 11h10M7 15h7"/>',
  community: '<circle cx="12" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2"/><path d="M15 14c2.5.4 4.3 2.3 4.7 4.8"/>',
  content: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10M7 11h10M7 15h7"/>',
  finance: '<circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 8l4 4 4-4"/>',
  menu: '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
  close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
};

const MENU_CATEGORIES = [
  {
    id: 'comercial',
    label: 'Comercial',
    icon: 'commercial',
    links: [
      { to: '/admin/ventas', label: 'Ventas', icon: 'box' },
      { to: '/admin/pedidos', label: 'Pedido', icon: 'box' },
      { to: '/admin/proveedores', label: 'Proveedores', icon: 'box' },
      { to: '/admin/productos', label: 'Productos', icon: 'candle' },
    ],
  },
  {
    id: 'comunidad',
    label: 'Comunidad',
    icon: 'community',
    links: [
      { to: '/admin/clientes', label: 'Clientes', icon: 'users' },
      { to: '/admin/suscriptores', label: 'Suscriptores', icon: 'users' },
      { to: '/admin/testimonios', label: 'Testimonios', icon: 'users' },
    ],
  },
  {
    id: 'contenido',
    label: 'Contenido',
    icon: 'content',
    links: [
      { to: '/admin/galeria', label: 'Galería', icon: 'grid' },
      { to: '/admin/eventos', label: 'Eventos', icon: 'calendar' },
      { to: '/admin/cuidados', label: 'Cuidados', icon: 'candle' },
    ],
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    icon: 'finance',
    links: [
      { to: '/admin/gastos', label: 'Gastos', icon: 'down' },
      { to: '/admin/costos', label: 'Costos', icon: 'tag' },
    ],
  },
];

export function Sidebar() {
  const { logout, user } = useAuth();
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <>
      {/* Botón hamburguesa móvil */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden fixed top-3 left-3 z-50 rounded-sm bg-amatista-deep p-2 text-cream"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" dangerouslySetInnerHTML={{ __html: ICONS.menu }} />
      </button>

      {/* Overlay móvil */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/50"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] flex-col bg-amatista-deep px-5 py-8 text-cream transition-transform duration-300 md:relative md:z-auto md:flex ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="mb-10 flex items-center justify-between px-2">
          <span className="font-serif text-xl font-semibold uppercase tracking-wide">Amatista</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-cream/70 hover:text-cream"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" dangerouslySetInnerHTML={{ __html: ICONS.close }} />
          </button>
        </div>
        
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {/* Dashboard siempre visible */}
          <NavLink
            to="/admin"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 rounded-sm border-l-2 px-3 py-2.5 text-sm transition-colors ${isActive ? 'border-gold bg-cream/10 text-gold-light' : 'border-transparent text-cream/70 hover:bg-cream/5 hover:text-cream'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-[18px] w-[18px] shrink-0" dangerouslySetInnerHTML={{ __html: ICONS.grid }} />
            Dashboard
          </NavLink>

          {/* Categorías acordeón */}
          {MENU_CATEGORIES.map((category) => (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className={`flex w-full items-center justify-between rounded-sm border-l-2 px-3 py-2.5 text-sm transition-colors ${
                  openCategories.has(category.id) 
                    ? 'border-gold bg-cream/10 text-gold-light' 
                    : 'border-transparent text-cream/70 hover:bg-cream/5 hover:text-cream'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-[18px] w-[18px] shrink-0" dangerouslySetInnerHTML={{ __html: ICONS[category.icon] }} />
                  {category.label}
                </div>
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.6" 
                  className={`h-4 w-4 shrink-0 transition-transform ${openCategories.has(category.id) ? 'rotate-180' : ''}`}
                  dangerouslySetInnerHTML={{ __html: ICONS.chevron }} 
                />
              </button>

              {/* Submenús */}
              {openCategories.has(category.id) && (
                <div className="ml-6 mt-1 flex flex-col gap-1">
                  {category.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={false}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => `flex items-center gap-3 rounded-sm border-l-2 px-3 py-2 text-sm transition-colors ${isActive ? 'border-gold bg-cream/10 text-gold-light' : 'border-transparent text-cream/60 hover:bg-cream/5 hover:text-cream'}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-[16px] w-[16px] shrink-0" dangerouslySetInnerHTML={{ __html: ICONS[link.icon] }} />
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="mt-6 border-t border-cream/15 px-3 pt-4">
          <div className="mb-3 text-xs text-cream/55">
            <span className="block font-medium text-cream/70">Usuario:</span>
            <span className="text-gold-light">{user?.nombre || 'Admin'}</span>
          </div>
          <button onClick={logout} className="w-full text-left text-xs uppercase tracking-wide text-cream/50 hover:text-gold-light transition-colors">
            ← Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
