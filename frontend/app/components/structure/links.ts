import { useMatch, useMatches } from 'react-router';

export interface LinkEntry {
  /** Pfad/Route des Links (in der Regel ein relativer URL-Pfad, z. B. '/fahrplaene'). */
  to: string;
  /** Anzeigename des Links, wird in der Navigation dargestellt und kann als Referenz für parentLink genutzt werden. */
  label: string;
}

export interface TopLink extends LinkEntry {
  /**
   * Wenn true, wird der Link in der Header Navigation nicht angezeigt.
   * Default: false
   */
  hideOnHeader?: boolean;
  /**
   * Wird auf Sidebar versteckt, wenn true.
   * Default: false
   */
  hideOnSidebar?: boolean;
  /** Unterpunkte dieser Gruppe/Links. Wird verwendet, um Unterpunkte dieser Gruppe zuzuordnen. */
  children?: LinkEntry[];
}

/**
 * Hinweise:
 * - Ein Eintrag sollte entweder isParent === true sein (eine Gruppe) oder ein parentLink auf einen Gruppen-Label-Wert setzen, um Unterpunkte zu bilden.
 * - to und label sind erforderlich für jeden Eintrag.
 */
export const LINKS: TopLink[] = [
  {
    to: '/',
    label: 'Startseite',
    hideOnHeader: true,
    hideOnSidebar: true,
  },
  {
    to: '/betrieb',
    label: 'Betrieb',
    children: [
      { to: '/fahrplaene', label: 'Umlauf / Fahrpläne' },
      { to: '/beschaffung', label: 'Beschaffung' },
      { to: '/betriebswerke', label: 'Betriebswerke' },
    ],
  },
  {
    to: '/community',
    label: 'Community',
    children: [
      { to: '/forum', label: 'Forum' },
      { to: '/chat', label: 'Chat' },
      { to: '/faq', label: 'FAQ' },
    ],
  },
  {
    to: '/info-zentrale',
    label: 'Info-Zentrale',
    children: [
      { to: '/einstieg', label: 'Der Einstieg' },
      { to: '/regeln', label: 'Regeln & Fahrpläne' },
      { to: '/ausschreibungen', label: 'Ausschreibungen' },
      { to: '/wartungsstandorte', label: 'Wartungsstandorte' },
      { to: '/trassen', label: 'Trassen' },
    ],
  },
  {
    to: '/aktuelles',
    label: 'Aktuelles',
    children: [
      { to: '/neuigkeiten', label: 'Neuigkeiten' },
      { to: '/as-vorschau', label: 'AS-Vorschau' },
      { to: '/termine', label: 'Termine' },
    ],
  },
  {
    to: '/gesellschaftsbereich',
    label: 'Gesellschaftsbereich',
    children: [
      { to: '/finanzen', label: 'Finanzen' },
      { to: '/fahrzeuge', label: 'Fahrzeuge' },
      { to: '/fahrplaene', label: 'Fahrpläne' },
    ],
  },
  {
    to: '/shop',
    label: 'Shop',
    children: [
      { to: '/wagen', label: 'Wagen' },
      { to: '/koks', label: 'Loks' },
      { to: '/handel', label: 'Handel' },
    ],
  },
];

/**
 * Hook: Ist der aktuelle Pfad auf der Startseiten-Route?
 *
 * Wenn exclusive true ist (Standard), wird true zurückgegeben, nur wenn der aktuelle Pfad die Startseite ist.
 * Wenn es false ist, wird true zurückgegeben, wenn der aktuelle Pfad die Startseite ist oder überhaupt keiner Route zugeordnet werden konnte.
 */
export function useIsHomepage(exclusive: boolean = true) {
  const route = useMatch({ path: '/', end: true });
  const matches = useMatches();

  if (exclusive) {
    return route !== null;
  }

  const lastMatch = matches.at(-1);
  return (
    lastMatch !== undefined &&
    (lastMatch.pathname.length <= 0 || lastMatch.pathname === '/')
  );
}
