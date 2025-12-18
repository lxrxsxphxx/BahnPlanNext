import { useState } from 'react';
import { NavLink } from 'react-router';

import LoginForm from '../login/LoginForm';
import { Modal } from '../modal/modal';
import Sidebar from './Sidebar';

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

const LINKS: LinkEntry[] = [
  { to: '/', label: 'Startseite', visibleOnFrontpage: true },
  {
    to: '/ausschreibungen',
    label: 'Ausschreibungen',
    visibleOnFrontpage: true,
  },
  { to: '/trassen', label: 'Trassen' },
  {
    to: '/betrieb',
    label: 'Betrieb',
    isParent: true,
    visibleOnFrontpage: true,
  },
  { to: '/fahrplaene', label: 'Umlauf / Fahrpläne', parentLink: 'Betrieb' },
  { to: '/beschaffung', label: 'Beschaffung', parentLink: 'Betrieb' },
  { to: '/betriebswerke', label: 'Betriebswerke', parentLink: 'Betrieb' },
  {
    to: '/community',
    label: 'Community',
    isParent: true,
    visibleOnFrontpage: true,
  },
  { to: '/forum', label: 'Forum', parentLink: 'Community' },
  { to: '/chat', label: 'Chat', parentLink: 'Community' },
  {
    to: '/gesellschaftsbereich',
    label: 'Gesellschaftsbereich',
    parentLink: 'Community',
  },
  { to: '/faq', label: 'FAQ', parentLink: 'Community' },
  { to: '/regeln', label: 'Regeln', visibleOnFrontpage: true },
];
/** Sollte isFrontPage true sein (-> bei der Startseite/Landing Page), wird die Navbar als horizontale Leiste oben dargestellt
Sollte isFrontPage false sein, wird die Navbar als vertikale Seitenleiste links und oben dargestellt */
/**
 * Navbar-Komponente, die je nach Seite entweder als horizontale Leiste (Startseite) oder als vertikale Seitenleiste (andere Seiten) gerendert wird.
 *
 * @param {{ isFrontPage?: boolean }} props - Die Eigenschaften der Komponente: ein optionaler Boolean-Wert, der angibt, ob die aktuelle Seite die Startseite ist.
 * @returns {JSX.Element} Die gerenderte Navbar-Komponente.
 */
export default function Navbar({
  isFrontPage = false,
}: {
  isFrontPage?: boolean;
}) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true); // Platzhalter für den Anmeldestatus

  return (
    <>
      {isFrontPage ? (
        <nav className="w-screen bg-black py-3 text-white shadow">
          <div className="mx-auto flex max-w-full items-center justify-between gap-4 px-15 py-3">
            <NavLink
              to="/"
              className="text-xl font-semibold tracking-wide text-white"
            >
              BahnPlan
            </NavLink>
            <div className="flex items-center gap-6">
              <ul className="hidden items-center gap-2 md:flex">
                {LINKS.filter((l) => l.visibleOnFrontpage).map((l) => (
                  <li key={l.to}>
                    <NavLink
                      to={l.to}
                      end
                      className={({ isActive }: { isActive: boolean }) =>
                        `rounded-md px-3 py-1 text-sm font-medium transition-colors ` +
                        (isActive
                          ? 'bg-white/20 text-white shadow-inner ring-1 ring-white/20'
                          : 'text-white/90 hover:bg-white/10')
                      }
                    >
                      {l.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            {!isUserLoggedIn ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="rounded-md px-3 py-1 text-sm font-medium text-white/90 transition-colors hover:cursor-pointer hover:bg-white/10"
                >
                  Anmelden
                </button>

                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="rounded-md border border-white/20 bg-white/90 px-3 py-1 text-sm font-semibold text-black/90 transition-colors hover:bg-white"
                >
                  Registrieren
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsUserLoggedIn(false)}
                className="rounded-md px-3 py-1 text-sm font-medium text-white/90 transition-colors hover:cursor-pointer hover:bg-white/10"
              >
                Logout
              </button>
            )}
          </div>
        </nav>
      ) : (
        <>
          <div className="h-16 w-screen bg-black md:pl-56">
            <div className="mx-auto flex h-full max-w-6xl items-center px-4">
              {/*suchleiste zentriert*/}
              <div className="flex flex-1 justify-center">
                <form
                  className="w-full max-w-md"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="search"
                    placeholder="Suche: Strecke / ID / Spieler ..."
                    className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/60 focus:ring-2 focus:ring-white/20 focus:outline-none"
                  />
                </form>
              </div>
              {!isUserLoggedIn ? (
                /* Anmelde + Registrieren Button */
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="rounded-md px-3 py-1 text-sm font-medium text-white/90 transition-colors hover:cursor-pointer hover:bg-white/10"
                  >
                    Anmelden
                  </button>

                  <button
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="rounded-md border border-white/20 bg-white/90 px-3 py-1 text-sm font-semibold text-black/90 transition-colors hover:bg-white"
                  >
                    Registrieren
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsUserLoggedIn(false)}
                  className="rounded-md px-3 py-1 text-sm font-medium text-white/90 transition-colors hover:cursor-pointer hover:bg-white/10"
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          <Sidebar links={LINKS} />
        </>
      )}

      {/* Login Modal */}
      <Modal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <LoginForm onClose={() => setIsLoginModalOpen(false)} />
      </Modal>

      {/* Register Modal */}
      <Modal
        open={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      >
        <div className="text-black">
          <h2 className="mb-4 text-xl font-semibold">Registrieren</h2>
          <p>Registrierungsformular kommt hier...</p>
        </div>
      </Modal>
    </>
  );
}
