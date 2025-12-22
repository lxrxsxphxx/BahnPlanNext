import { NavLink } from 'react-router';
import type { LinkEntry } from './Navbar';

/**
 * 
 * Sidebar-Komponente, die eine seitliche Navigationsleiste rendert (nur auf Nicht-Startseiten).
 *
 * @param {{ links: LinkEntry[] }} props - Die Eigenschaften der Komponente: ein Array von Link-Einträgen.
 * @returns {JSX.Element} Die gerenderte Sidebar-Komponente.
 */

export default function Sidebar({ links }: { links: LinkEntry[] }) {


  return (
    <nav className="fixed top-0 left-0 z-40 h-screen w-56 bg-[#111821] text-white shadow">
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="py-4 pl-8">
            <NavLink to="/" className="text-2xl font-semibold tracking-wide text-white">
              BahnPlan
            </NavLink>
          </div>

          <ul className="flex flex-col gap-1 px-3">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end
                  className={({ isActive }: { isActive: boolean }) =>
                    `block rounded-md px-3 py-2 text-left text-sm transition-colors ` +
                    (isActive
                      ? 'bg-white/20 text-white shadow-inner ring-1 ring-white/20'
                      : 'text-white/90 hover:bg-white/10') +
                    (l.isParent ? ' font-bold' : ' font-normal') +
                    (l.visibleOnFrontpage ? ' pr-25 text-left' : ' pl-10')
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
