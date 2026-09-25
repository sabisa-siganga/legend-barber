import { NavLink, Outlet } from 'react-router';

const navigationLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services', end: false },
  { to: '/about', label: 'About', end: false },
  { to: '/contact', label: 'Contact', end: false },
  { to: '/terms', label: 'Terms', end: false },
  { to: '/admin/login', label: 'Admin login', end: false },
  { to: '/admin/bookings', label: 'Admin bookings', end: false },
] as const;

export function AppLayout() {
  return (
    <div className="min-h-screen bg-ink text-bone">
      <header className="border-b border-concrete/40">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <NavLink to="/" className="text-sm font-semibold tracking-wide">
            Legend Barber
          </NavLink>
          <nav aria-label="Primary" className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (
                  isActive ? 'text-rust' : 'text-bone hover:text-rust'
                )}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
