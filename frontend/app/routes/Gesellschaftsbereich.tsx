import { NavLink } from 'react-router';

import type { Route } from './+types/Beschaffung';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Gesellschaftsbereich - BahnPlan' },
    { name: 'description', content: 'Kaufe Loks, Wagen, Trassen und mehr' },
  ];
}

/**
 * **Gesellschaftsbereich**
 * * Unternehmensverwaltung: Sie steuert den Zugriff auf Finanzdaten, Fahrzeuge und Fahrpläne oder leitet den Nutzer zum 
 * Erstellungsprozess weiter, falls noch keine Gesellschaft existiert.
 *
 * ### Hauptkomponenten
 * 1. **Gesellschaftsbereich (Default Export)**: 
 * - Prüft beim Laden den Status des Nutzers (`fetchCompanyInfo2`).
 * - Zeigt bei Erfolg ein Dashboard mit Kategorien (Finanzen, Fahrzeuge, Fahrpläne) an.
 * - Rendert bei Fehlen einer Gesellschaft den `gesellschaftErstellenHinweis`.
 * 
* 2. **CreateCompanyForm**:
 * - Ein spezialisiertes Formular zur Neuanlage einer Eisenbahngesellschaft.
 * - Beinhaltet eine strikte Namensvalidierung (Regex) und Fehlerbehandlung.
 * - Führt nach Erfolg eine automatische Weiterleitung nach 2 Sekunden durch.
 *
 * 3. **gesellschaftErstellenHinweis**:
 * - Eine informative Ansicht, die rechtliche Hinweise (Namensrechte) und Spielregeln 
 * (Startguthaben von 4 Mio. €) erläutert.
 *
 * ### Funktionalitäten & Logik
 * - **Authentifizierungs-Check**: Nutzt `useEffect`, um sicherzustellen, dass nur Nutzer mit einer gültigen `userCompany` das Dashboard sehen.
 * - **Validierungs-Regeln**: Erlaubt für Firmennamen nur Alphanumerische Zeichen und Standard-Satzzeichen, um SQL-Injections oder unleserliche Namen zu verhindern.
 * - **UX-Feedback**: Implementiert Ladezustände (`loading`) und visuelle Rückmeldungen für Erfolg oder Fehler bei der API-Kommunikation.
 * - **Navigation**: Nutzt `NavLink` für aktives Styling der Unterbereiche und `useNavigate` für den Flow nach der Erstellung.
 *
 * @category Pages / Management
 * @example
 * ```tsx
 * // Die Route wird in der Regel über das Hauptmenü angesteuert:
 * <Route path="gesellschaftsbereich" element={<Gesellschaftsbereich />} />
 * ```
 */

export default function Gesellschaftsbereich() {
  const categories = [
    { name: 'Finanzen', path: '/gesellschaftsbereich/finanzen' },
    { name: 'Fahrzeuge', path: '/gesellschaftsbereich/fahrzeuge' },
    { name: 'Fahrpläne', path: '/gesellschaftsbereich/fahrplaene' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F14] p-8 text-white">
      <h1 className="mb-8 text-4xl font-bold">Gesellschaftsbereich: </h1>

      {/* Kategorien Abschnitt */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.name}
            className="rounded-lg border border-[#223041] bg-[#121C27] p-8 transition-colors hover:border-gray-600"
          >
            <h2 className="mb-6 text-2xl font-semibold">{category.name}</h2>
            <NavLink
              to={category.path}
              className={({ isActive }: { isActive: boolean }) =>
                `inline-block rounded-md px-6 py-2 text-sm font-medium transition-colors ` +
                (isActive ? 'bg-gray-600' : 'bg-gray-700 hover:bg-gray-600')
              }
            >
              Details
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}
