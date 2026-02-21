// Trassenübersicht Komponente & Models
import { useLoaderData } from "react-router";
import type { Route } from "../+types/root";
import { getTrassen, type Trasse, type TrassenGruppe, type TrassenStops } from "@/services/trassen";

/**
 * **TrassenComponent**
 * * Eine tabellarische Übersicht aller verfügbaren Trassen (Fahrwegkapazitäten), 
 * gruppiert nach Kategorien (z.B. Nahverkehr, Fernverkehr, Güterverkehr).
 * * ### Kernfunktionalitäten
 * - **Datenaufbereitung**: Sortiert Haltestellen (`stops`) chronologisch nach ihrer Sequenz-ID.
 * - **Bidirektionale Anzeige**: Stellt sowohl die Hin- (A) als auch die Rückfahrt (B) mit Abfahrts- und Ankunftszeiten dar.
 * - **Dynamisches Mapping**: Generiert eine visuelle "String-Chain" der Haltestellen für jede Trasse.
 * - **Gruppierung**: Zeigt Trassen innerhalb ihrer jeweiligen {@link TrassenGruppe} an und blendet leere Gruppen automatisch aus.
 * * ### Logik-Hilfsfunktionen
 * - `sortStops`: Stellt sicher, dass die Haltestellen unabhängig von der API-Reihenfolge korrekt sortiert sind.
 * - `getFirstAndLast`: Extrahiert Start- und Endpunkte für die kompakte Zeitdarstellung.
 * * ### Datenfluss
 * 1. Der {@link clientLoader} ruft die Trassendaten ab.
 * 2. `useLoaderData` stellt die Daten der Komponente zur Verfügung.
 * 3. `useMemo` (implizit durch Mapping) transformiert die Stops für die Anzeige.
 * * @category Pages
 */
export async function loader({ }: Route.LoaderArgs) {
  return { trassen: [] };
}

export async function clientLoader({ }: Route.ClientLoaderArgs) {

  const trassen = await getTrassen();
  return { trassen };
}
clientLoader.hydrate = true as const;

function sortStops(stops: TrassenStops[]): TrassenStops[] {
  return [...stops].sort((a, b) => a.seq - b.seq);
}
function getFirstAndLast(stops: TrassenStops[]) {
  const sorted = sortStops(stops);
  return {
    first: sorted.at(0),
    last: sorted.at(sorted.length - 1),
    sorted,
  };
}


export default function TrassenComponent() {
  const { trassen } = useLoaderData<typeof clientLoader>();

  return (

    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {trassen.map((group: TrassenGruppe, groupIdx: number) => (
        group.trassen.length === 0 ? null : (
          <div
            key={groupIdx}
            className="bg-gray-800 rounded shadow-md p-4"
          >

            <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2 mb-4">
              {group.label}
            </h2>

            <div className="flex flex-col gap-4">
              <table>
                {group.trassen.map((trasse: Trasse, trasseIdx: number) => {
                  const { first, last, sorted } = getFirstAndLast(trasse.stops);

                  return (
                    <div
                      key={trasseIdx}
                      className="grid grid-cols-[200px_1fr] gap-4 items-start border-b border-gray-700 py-3"
                    >
                      {/* Trasse name */}
                      <div className="font-semibold text-white">
                        {trasse.name}
                      </div>

                      {/* Right side (A / B rows) */}
                      <div className="flex flex-col gap-2">
                        {/* A */}
                        <div className="grid grid-cols-[160px_1fr] gap-4">
                          <div className="text-gray-300">
                            {first?.dep_a} - {last?.arr_a}
                          </div>
                          <div className="text-gray-200">
                            {sorted.map(stop => stop.station_name).join(" - ")}
                          </div>
                        </div>

                        {/* B */}
                        <div className="grid grid-cols-[160px_1fr] gap-4">
                          <div className="text-gray-300">
                            {first?.dep_b} - {last?.arr_b}
                          </div>
                          <div className="text-gray-200">
                            {sorted.map(stop => stop.station_name).join(" - ")}
                          </div>
                        </div>
                      </div>
                    </div>

                  );
                })}

              </table>
            </div>
          </div>
        )
      ))}
    </div>
  );
}
