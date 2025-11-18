import { memo } from 'react';
import { NavLink } from 'react-router';

import { LINKS, useIsHomepage } from './links';

// Mit memo cachen, damit nicht neu gerendert wird – LINKS ändert sich ja nie.
const Links = memo(function Links() {
  return LINKS.filter((l) => l.visibleOnFrontpage).map((l) => (
    <li key={l.to}>
      <NavLink
        to={l.to}
        end
        className={({ isActive }: { isActive: boolean }) =>
          'rounded-md px-3 py-1 text-sm font-medium transition-colors ' +
          (isActive
            ? 'bg-white/20 text-white shadow-inner ring-1 ring-white/20'
            : 'text-white/90 hover:bg-white/10')
        }
      >
        {l.label}
      </NavLink>
    </li>
  ));
});

export default function Navbar() {
  const isHomepage = useIsHomepage();

  let middle;
  if (isHomepage) {
    middle = (
      <nav className="flex items-center gap-6">
        <ul className="hidden items-center gap-2 md:flex">
          <Links />
        </ul>
      </nav>
    );
  } else {
    middle = (
      <div className="flex flex-1 justify-center">
        <form className="w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
          <input
            type="search"
            placeholder="Suche: Strecke / ID / Spieler ..."
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/60 focus:ring-2 focus:ring-white/20 focus:outline-none"
          />
        </form>
      </div>
    );
  }

  return (
    <header className="sticky top-0 flex h-(--header-height) w-full items-center justify-between gap-4 bg-black px-15 py-6 text-white shadow">
      <NavLink
        to="/"
        className="text-xl font-semibold tracking-wide text-white"
      >
        BahnPlan
      </NavLink>

      {middle}

      <div className="flex items-center gap-3">
        <NavLink
          to="/login"
          className={({ isActive }: { isActive: boolean }) =>
            'rounded-md px-3 py-1 text-sm font-medium transition-colors ' +
            (isActive
              ? 'bg-white/20 text-white'
              : 'text-white/90 hover:bg-white/10')
          }
        >
          Anmelden
        </NavLink>

        <NavLink
          to="/register"
          className={({ isActive }: { isActive: boolean }) =>
            'rounded-md border border-white/20 px-3 py-1 text-sm font-semibold transition-colors ' +
            (isActive
              ? 'bg-white text-black'
              : 'bg-white/90 text-black/90 hover:bg-white')
          }
        >
          Registrieren
        </NavLink>
      </div>
    </header>
  );
}
