import { NavLink } from 'react-router';
/**
 * Typdefinition für einen Navigationseintrag.
 *
 * Eigenschaften:
 * - to: string
 *   Der Pfad, zu dem der Link navigiert (z. B. '/betrieb').
 * - label: string
 *   Der angezeigte Text des Links (z. B. 'Betrieb').
 * - visibleOnFrontpage?: boolean
 *   Optional. Wenn true, soll der Link auf der Startseite bzw. in einer frontpage-spezifischen Ansicht sichtbar/gehoben angezeigt werden.
 *  Standardverhalten: false (wenn nicht angegeben, nicht speziell auf der Frontpage hervorgehoben).
 * - isParent?: boolean
 *   Optional. Kennzeichnet diesen Eintrag als übergeordneten Menüpunkt/Gruppierung (z. B. "Betrieb", "Community").
 *   Standardverhalten: false.
 * - parentLink?: string
 *   Optional. Verweist auf das label des übergeordneten Eintrags (z. B. 'Betrieb'). Wird verwendet, um Unterpunkte einer Gruppe zuzuordnen.
 *   Erwartung: parentLink entspricht genau dem label des Eintrags mit isParent === true.
 */
export type LinkEntry = {
  to: string;
  label: string;
  visibleOnFrontpage?: boolean;
  isParent?: boolean;
  parentLink?: string;
};

/**
 * 
 * Sidebar-Komponente, die eine seitliche Navigationsleiste rendert (nur auf Nicht-Startseiten).
 *
 * @param {{ links: LinkEntry[] }} props - Die Eigenschaften der Komponente: ein Array von Link-Einträgen.
 * @returns {JSX.Element} Die gerenderte Sidebar-Komponente.
 */

export default function Sidebar({ links }: { links: LinkEntry[] }) {


  return (
    <nav className="fixed top-0 left-0 z-40 h-screen w-56 bg-black text-white shadow">
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
