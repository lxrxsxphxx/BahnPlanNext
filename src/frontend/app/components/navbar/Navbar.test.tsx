/**
 * @file Navbar.test.tsx
 * @description
 * Dient zum Testen der `Navbar`-Komponente. Die Tests prüfen sowohl die
 * horizontale Darstellung (Frontpage) als auch die Sidebar-Version und das
 * Verhalten aktiver Links.
 *
 * Hinweis: `react-router` wird hier gemockt, damit die Tests deterministisch
 * ausgeführt werden können ohne den kompletten Router-Infrastrukturaufbau.
 */
import { expect, test, vi, afterEach } from 'vitest';
import { render } from 'vitest-browser-react';

/**
 * Mock für das `react-router`-Modul, speziell für `NavLink`.
 *
 * Zweck:
 * - Ersetzt `NavLink` durch eine einfache `<a>`-Element-Fabrik, die in den
 *   Tests verwendet wird. Dadurch müssen wir keinen echten Router initialisieren.
 * - Ermöglicht es den Tests, den aktiven Pfad über `globalThis.__TEST_CURRENT_PATH__`
 *   zu simulieren, wodurch `isActive` deterministisch gesetzt werden kann.
 *
 * Verhalten der Mock-Implementierung:
 * - Akzeptiert die üblichen Props (`to`, `children`, `className`, `end`).
 * - Liest `globalThis.__TEST_CURRENT_PATH__` (falls gesetzt) und vergleicht mit `to`.
 * - Falls `className` eine Funktion ist (wie bei `NavLink` üblich), wird sie mit
 *   `{ isActive }` aufgerufen, andernfalls wird der String unverändert verwendet.
 * - Gibt ein DOM-Element (`a`) mit `href`, `data-to` und `className` zurück,
 *   damit Tests auf diese Attribute zugreifen können.
 *
 * @returns {object} Mock-Exports für `react-router`.
 */
vi.mock('react-router', async () => {
  const React = (await vi.importActual('react')) as any;
  return {
    NavLink: ({ to, children, className, end }: any) => {
      const activePath = (globalThis as any).__TEST_CURRENT_PATH__ || '/';
      const isActive = activePath === to;
      const cls = typeof className === 'function' ? className({ isActive }) : className;
      return React.createElement('a', { href: to, 'data-to': to, className: cls }, children);
    },
  } as any;
});

import Navbar from './Navbar';

/**
 * Test: Rendert die horizontale Navbar im Frontpage-Modus und prüft,
 * ob zentrale Links und Auth-Buttons vorhanden sind.
 *
 * @async
 * @returns {Promise<void>} Erwartet, dass die Elemente im DOM vorhanden sind.
 */
test('renders horizontal navbar (front page) and shows frontpage links', async () => {
  const screen = await render(<Navbar isFrontPage={true} />);
  await expect.element(screen.getByText('BahnPlan')).toBeInTheDocument();

  await expect.element(screen.getByText('Ausschreibungen')).toBeInTheDocument();

  await expect.element(screen.getByText('Anmelden')).toBeInTheDocument();
  await expect.element(screen.getByText('Registrieren')).toBeInTheDocument();
});

/**
 * Test: Rendert die Sidebar-Variante (non-front page) und prüft,
 * dass die erweiterte Linkliste und das Suchfeld angezeigt werden.
 *
 * @async
 * @returns {Promise<void>} Erwartet Sichtbarkeit von Sidebar-Elementen.
 */
test('renders sidebar (non-front page) and shows full link list and search input', async () => {
  const screen = await render(<Navbar isFrontPage={false} />);
  await expect.element(screen.getByText('BahnPlan')).toBeInTheDocument();

  await expect.element(screen.getByText('Umlauf / Fahrpläne')).toBeInTheDocument();

  const input = screen.getByPlaceholder('Suche: Strecke / ID / Spieler ...');
  await expect.element(input).toBeInTheDocument();
});

/**
 * Test: Stellt sicher, dass die aktive Klasse an der korrekten NavLink-Instanz
 * angewendet wird.
 *
 * Ablauf:
 * - Setzt `globalThis.__TEST_CURRENT_PATH__` auf den gewünschten Pfad.
 * - Rendert die Navbar und überprüft, ob der Link die erwartete
 *   Active-Klasse (`bg-white/20`) besitzt.
 *
 * @async
 * @returns {Promise<void>} Erwartet, dass der aktive Link die Style-Klasse hat.
 */
test('applies active styles to the correct NavLink', async () => {
  (globalThis as any).__TEST_CURRENT_PATH__ = '/ausschreibungen';

  const screen = await render(<Navbar isFrontPage={true} />);
  const activeLink = screen.getByText('Ausschreibungen');
    await expect.element(activeLink).toBeInTheDocument();
    await expect.element(activeLink).toHaveClass('bg-white/20');
});

/**
 * Cleanup nach jedem Test: Entfernt die ggf. gesetzte Simulation des aktuellen
 * Pfads aus `globalThis`, damit nachfolgende Tests nicht beeinflusst werden.
 */
afterEach(() => {
  delete (globalThis as any).__TEST_CURRENT_PATH__;
});
