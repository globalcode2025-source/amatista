import { NavLink } from 'react-router-dom';

const ICONS: Record<string, string> = {
  grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  box: '<path d="M3 8l9-5 9 5-9 5-9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M15 14.2c2.5.4 4.3 2.3 4.7 4.8"/>',
  candle: '<path d="M12 3c1.6 2 3 3.4 3 5a3 3 0 1 1-6 0c0-1.6 1.4-3 3-5Z"/><path d="M7 10h10v6a5 5 0 0 1-10 0v-6Z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  up: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  down: '<path d="M3 7l6 6 4-4 8 8"/><path d="M15 17h6v-6"/>',
  tag: '<path d="M20 12l-8 8-9-9V3h8l9 9Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
};

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true, icon: 'grid' },
  { to: '/admin/pedidos', label: 'Pedidos', end: false, icon: 'box' },
  { to: '/admin/clientes', label: 'Clientes', end: false, icon: 'users' },
  { to: '/admin/productos', label: 'Productos', end: false, icon: 'candle' },
  { to: '/admin/eventos', label: 'Eventos', end: false, icon: 'calendar' },
  { to: '/admin/ingresos', label: 'Ingresos', end: false, icon: 'up' },
  { to: '/admin/gastos', label: 'Gastos', end: false, icon: 'down' },
  { to: '/admin/costos', label: 'Costos', end: false, icon: 'tag' },
];

export function Sidebar() {
  return (
    <aside className="hidden w-[240px] shrink-0 flex-col bg-amatista-deep px-5 py-8 text-cream md:flex">
      <div className="mb-10 flex items-center gap-2.5 px-2 font-serif text-lg uppercase tracking-wide">
        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" className="h-7 w-7 shrink-0">
          <path d="M20 4c2 4 4 5 4 8a4 4 0 1 1-8 0c0-3 2-4 4-8Z" strokeWidth="1.4" />
          <path d="M9 18c0-3 3-5 5-5h12c2 0 5 2 5 5v6c0 6-5 10-11 10S9 30 9 24v-6Z" strokeWidth="1.4" />
          <circle cx="20" cy="22" r="4" strokeWidth="1.4" />
        </svg>
        Amatista
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-sm border-l-2 px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'border-gold bg-cream/10 text-gold-light'
                  : 'border-transparent text-cream/70 hover:bg-cream/5 hover:text-cream'
              }`
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-[18px] w-[18px] shrink-0"
              dangerouslySetInnerHTML={{ __html: ICONS[l.icon] }}
            />
            {l.label}
          </NavLink>
        ))}
      </nav>

      <a href="/" className="mt-6 px-3 text-xs uppercase tracking-wide text-cream/50 hover:text-gold-light">
        ← Ver sitio
      </a>
    </aside>
  );
}

export default Sidebar;