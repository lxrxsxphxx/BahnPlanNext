import { useMatch, useMatches } from 'react-router';

export interface LinkEntry {
  /** Pfad/Route des Links (in der Regel ein relativer URL-Pfad, z. B. '/fahrplaene'). */
  to: string;
  /** Anzeigename des Links, wird in der Navigation dargestellt und kann als Referenz für parentLink genutzt werden. */
  label: string;
}

export interface TopLink extends LinkEntry {
  /**
   * Wenn true, soll der Link auf der Startseite bzw. in einer frontpage-spezifischen Ansicht sichtbar/gehoben angezeigt werden.
   * Standardverhalten: false (wenn nicht angegeben, nicht speziell auf der Frontpage hervorgehoben).
   */
  visibleOnFrontpage?: boolean;
  /** Wird auf Sidebar versteckt, wenn true. */
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
    visibleOnFrontpage: true,
    hideOnSidebar: true,
  },
  {
    to: '/ausschreibungen',
    label: 'Ausschreibungen',
    visibleOnFrontpage: true,
  },
  {
    to: '/betrieb',
    label: 'Betrieb',
    visibleOnFrontpage: true,
    children: [
      { to: '/fahrplaene', label: 'Umlauf / Fahrpläne' },
      { to: '/beschaffung', label: 'Beschaffung' },
      { to: '/betriebswerke', label: 'Betriebswerke' },
    ],
  },
  {
    to: '/community',
    label: 'Community',
    visibleOnFrontpage: true,
    children: [
      { to: '/forum', label: 'Forum' },
      { to: '/chat', label: 'Chat' },
      {
        to: '/gesellschaftsbereich',
        label: 'Gesellschaftsbereich',
      },
      { to: '/faq', label: 'FAQ' },
    ],
  },
  { to: '/regeln', label: 'Regeln', visibleOnFrontpage: true },
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
