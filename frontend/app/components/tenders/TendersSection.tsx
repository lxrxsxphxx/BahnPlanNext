import Tender from './Tender';
import { type OpenTender } from '@/services/tender';

/**
 * **TendersSection**
 *
 * Eine Container-Komponente zur Darstellung einer Liste von offenen Ausschreibungen.
 *
 * ### Funktionalitäten
 * - **Listen-Rendering**: Iteriert über ein Array von Ausschreibungsobjekten und rendert für jedes Element eine {@link Tender}-Komponente.
 * - **Empty State**: Zeigt eine benutzerfreundliche Nachricht an, wenn keine Ausschreibungen vorhanden sind.
 * - **Layout**: Organisiert die Einträge in einer Sektion mit vertikalen Trennlinien (`divide-y`).
 *
 * ### Logik & Rendering
 * - **Bedingte Anzeige**: Unterscheidet strikt zwischen `openTenders.length === 0` (Leer-Nachricht) und `openTenders.length > 0` (Liste).
 * - **Key-Management**: Nutzt die eindeutige `id` aus dem {@link OpenTender} Objekt als React-Key für optimiertes Re-Rendering.
 *
 * ### Props
 * - `openTenders` (`OpenTender[]`): Ein Array von Objekten, die die Daten der auszuschreibenden Aufträge enthalten.
 *
 * @param props - Die Eigenschaften der Komponente.
 * @returns Eine Sektion mit einer Überschrift und der Liste der Ausschreibungen.
 *
 * @example
 * ```tsx
 * const data = [{ id: '1', name: 'Tour A', difficulty: 'easy' }];
 * <TendersSection openTenders={data} />
 * ```
 *
 * @category Components
 */
export default function TendersSection({
  openTenders,
}: {
  openTenders: OpenTender[];
}) {
  return (
    <section className="p-6 text-white">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Neue Ausschreibungen</h2>
      </div>

      {openTenders.length === 0 && (
        <div className="text-gray-300">
          Aktuell keine offenen Ausschreibungen.
        </div>
      )}

      {openTenders.length > 0 && (
        <div className="divide-y ">
          {openTenders.map((t) => (
            <Tender key={t.id} tender={t} />
          ))}
        </div>
      )}
    </section>
  );
}
