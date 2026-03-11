import { useState } from "react";
import { useLoaderData } from 'react-router';
import { fetchCompanyInfo } from "@/services/gesellschaftsbereich";

export async function clientLoader() {
  try {
    const company = await fetchCompanyInfo();
    return { company };
  } catch (err) {
    console.error('Fehler beim Laden der Company im Loader:', err);
    return { error: (err as Error).message || 'Fehler beim Laden der Company' };
  }
}

const KREDITE = [
  {
    id: "start",
    title: "Start",
    amount: "500.000 €",
    interestWeek: "0,15% pro Woche",
    interestYear: "8,1% pro Jahr",
    description: "Ideal für kleine Loks/Wagen und kurze Strecken",
  },
  {
    id: "erweiterung",
    title: "Erweiterung",
    amount: "10.000.000 €",
    interestWeek: "0,15% pro Woche",
    interestYear: "8,1% pro Jahr",
    description: "Ideal für mehrere Loks/Wagen und mittlere Strecken",
  },
  {
    id: "gross",
    title: "Großinvestition",
    amount: "50.000.000 €",
    interestWeek: "0,15% pro Woche",
    interestYear: "8,1% pro Jahr",
    description:
      "Ideal für viele Loks/Wagen, große Strecken und alle Ausschreibungen",
  },
];

/**
 * **Kredite**
 * Diese Komponente stellt das Finanzierungs-Interface des Spiels dar. Spieler können hier 
 * verschiedene Kreditpakete einsehen und auswählen, um ihr Kapital zu erhöhen.
 * Sie kombiniert Live-Daten des Unternehmens mit statischen Kredit-Angeboten.
 *
 * ### Aktueller Status (Integration)
 * - **Read-Only (Live)**: Das aktuelle Kapital (`cashBalance`) wird via `clientLoader` 
 * echtzeitnah aus dem Backend geladen (`fetchCompanyInfo`).
 * - **Mock-Daten (Statisch)**: Die Kreditangebote (`KREDITE`) sind fest kodiert. Es erfolgt 
 * momentan **keine** API-Transaktion beim Klick auf "Auswählen".
 * - **Fehlende Logik**: Die Verrechnung des Kreditbetrags mit dem Kontostand sowie die 
 * Zinsberechnung (Zinsen/Tilgung) sind noch nicht implementiert (Backend-Task).
 *
 * ### Funktionalitäten
 * - **Kapital-Display**: Anzeige des liquiden Kapitals der Gesellschaft, formatiert als 
 * Währung (Euro, de-DE).
 * - **Selektions-Logik**: Ein lokaler State (`selectedId`) ermöglicht das visuelle 
 * Hervorheben eines Kreditpakets zur Vorbereitung eines zukünftigen "Kredit-Abschluss"-Flows.
 * - **Informations-Design**: Detaillierte Darstellung von wöchentlichen vs. jährlichen 
 * Zinssätzen zur Unterstützung der Spieler-Entscheidung.
 *
 * ### Geplante Erweiterungen
 * 1. Implementierung einer `action`-Funktion für den POST-Request zum Backend.
 * 2. Dynamische Berechnung der Zinslast basierend auf dem aktuellen Firmen-Rating.
 * 3. Validierung: Deaktivierung von Krediten, die das Kreditlimit der Firma überschreiten.
 *
 * @category Pages / Finance
 * @status In-Progress / UI-Only
 * @example
 * ```tsx
 * // Der Loader stellt sicher, dass das Kapital bekannt ist, bevor die Seite lädt.
 * <Route path="kredite" element={<Kredite />} loader={clientLoader} />
 * ```
 */

export default function Kredite() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { company, error } = useLoaderData<typeof clientLoader>();
  const cashBalance = company?.capital ?? 4000000;
  return (
    <div className="w-full mx-auto mt-6  px-10 py-8">
      {/* Titel */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="mb-6 text-3xl font-semibold text-white">
                Shop &gt; Kredite
            </h1>

            <div className="rounded-md bg-gray-800 px-4 py-2 text-sm text-white">
                {cashBalance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </div>
        </div>

      {/* Kreditkarten */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {KREDITE.map((kredit) => {
          const selected = selectedId === kredit.id;

          return (
            <div
              key={kredit.id}
              className={`rounded-2xl border bg-gradient-to-b from-slate-800 to-slate-900 p-6 text-white shadow-lg transition-all flex flex-col ${
                selected
                  ? "border-blue-500 ring-2 ring-blue-500"
                  : "border-slate-700 hover:border-slate-500"
              }`}
              
            >
              {/* Titel */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium">{kredit.title}</h2>
              </div>

              {/* Betrag */}
              <div className="mb-4 text-3xl font-bold">{kredit.amount}</div>

              {/* Zinsen */}
              <div className="mb-4 text-sm text-slate-300">
                <div>Zinssatz: {kredit.interestWeek}</div>
                <div>{kredit.interestYear}</div>
              </div>

              {/* Beschreibung */}
              <p className="mb-6 text-sm text-slate-300">
                {kredit.description}
              </p>

              <div className="flex-grow" />

              {/* Auswahl-Button */}
              <button
                onClick={() => setSelectedId(kredit.id)}
                className={`w-full rounded-lg px-4 py-2 font-medium transition ${
                  selected
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                }`}
              >
                {selected ? "Ausgewählt" : "Kredit auswählen"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Hinweis */}
      <p className="mt-6 text-xs text-slate-400">
        Hinweis zur Rückzahlung: Automatische wöchentliche Abzüge von Ihrem
        Kontostand.
      </p>
    </div>
  );
}


