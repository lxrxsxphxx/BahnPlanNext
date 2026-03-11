import { useState } from 'react';
import { Link, useLoaderData } from 'react-router';

import ShowLoks from '@/components/ShowLoks';
import {
  fetchCompaniesLoks,
  fetchCompanyInfo,
} from '@/services/gesellschaftsbereich';

export async function clientLoader() {
  try {
    const loks = await fetchCompaniesLoks();
    const company = await fetchCompanyInfo();
    // Debug: show raw payload so missing fields can be inspected in browser console
    // Remove or guard this in production.
    // eslint-disable-next-line no-console
    console.debug('clientLoader: company, loks', { company, loks });
    return { loks, company };
  } catch (err) {
    console.error('Fehler beim Laden der Loks im Loader:', err);
    return {
      error: (err as Error).message || 'Fehler beim Laden der Loks',
    };
  }
}

/**
 * **GesellschaftsbereichFahrzeuge**
 *
 * Diese Seite dient als Übersicht für alle Fahrzeuge (Lokomotiven und Wagen), 
 * die sich im Besitz der aktiven Gesellschaft befinden.
 *
 * ### Funktionalitäten
 * - **Daten-Preloading**: Nutzt den `clientLoader`, um parallel die Liste der Lokomotiven (`fetchCompaniesLoks`) und die Unternehmensdaten (`fetchCompanyInfo`) zu laden.
 * - **Tab-Navigation**: Ermöglicht den Wechsel zwischen der Ansicht für "Loks" und "Wagen".
 * - **Finanz-Status**: Zeigt das aktuelle Firmenkapital im Header an, um dem Nutzer sofortiges Feedback über sein Budget zu geben.
 * - **Fehler-Handling**: Fängt API-Fehler im Loader ab und stellt sie dem Nutzer über ein Error-Banner zur Verfügung.
 *
 * ### Logik & State-Management
 * - **isWagonActive (State)**: Steuert das UI-Umschalten zwischen den Fahrzeugtypen. Da der Wagen-Bereich noch in Entwicklung ist, wird hier derzeit ein Platzhalter (WIP-Hinweis) gerendert.
 * - **Integration von ShowLoks**: Die Komponente fungiert als Container für `ShowLoks`, welche die eigentliche Transformation und das Rendering der Lok-Karten übernimmt.
 * - **Breadcrumb-Navigation**: Ermöglicht über den Titel eine schnelle Rückkehr zur Hauptübersicht des Gesellschaftsbereichs.
 *
 * ### Status & Entwicklungshintergrund
 * - **Live**: Der Lok-Bereich ist voll funktionsfähig und an die Datenbank angebunden.
 * - **WIP (Work in Progress)**: Der Wagen-Bereich zeigt aktuell nur eine Informationsmeldung an. Die API-Anbindung für Wagen muss noch implementiert werden.
 *
 * @category Pages / Inventory
 * @example
 * ```tsx
 * // Route in der App-Konfiguration
 * <Route 
 * path="gesellschaftsbereich/fahrzeuge" 
 * element={<GesellschaftsbereichFahrzeuge />} 
 * loader={clientLoader} 
 * />
 * ```
 */

export default function GesellschaftsbereichFahrzeuge() {
  const { loks, company, error } = useLoaderData<typeof clientLoader>();
  const [isWagonActive, setIsWagonActive] = useState(false);
  const cashBalance = company?.capital ?? 4000000;

  return (
    <div className="min-h-screen bg-[#0B0F14] p-8 text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          <Link to="/gesellschaftsbereich">Gesellschaftsbereich</Link> &gt;
          Meine Fahrzeuge
        </h1>
        {error && (
          <div className="mt-4 rounded-md bg-red-500/20 p-4 text-red-200">
            <p>
              Fehler beim Laden der Fahrzeuge aus der Datenbank. Fehler: {error}
            </p>
          </div>
        )}
        {company?.name && (
          <div className="mb-4 flex items-center justify-between">
            <div className="text-2xl text-gray-300">{company.name}</div>
            <div className="rounded-md bg-gray-800 px-4 py-2 text-sm">
              {cashBalance.toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR',
              })}
            </div>
          </div>
        )}
      </div>
      <div className="mt-10 mb-6 flex items-end gap-6">
        <button
          type="button"
          onClick={() => setIsWagonActive(false)}
          aria-pressed={!isWagonActive}
          className={`text-lg font-semibold ${!isWagonActive ? 'border-b-4 border-blue-500 pb-2 text-white' : 'pb-3 text-gray-400'} hover:cursor-pointer`}
        >
          Loks
        </button>

        <button
          type="button"
          onClick={() => setIsWagonActive(true)}
          aria-pressed={isWagonActive}
          className={`text-lg font-semibold ${isWagonActive ? 'border-b-4 border-blue-500 pb-2 text-white' : 'pb-3 text-gray-400'} hover:cursor-pointer`}
        >
          Wagen
        </button>
      </div>
      {!isWagonActive && <ShowLoks loks={loks} error={error} />}
      {isWagonActive && (
        <div className="mt-6 rounded-md bg-yellow-500/20 p-4 text-yellow-200">
          <p>
            Der Wagen-Bereich ist derzeit noch in Entwicklung. Bitte hab etwas
            Geduld, während wir daran arbeiten, dir bald auch deine Wagen
            anzuzeigen!
          </p>
        </div>
      )}
    </div>
  );
}
