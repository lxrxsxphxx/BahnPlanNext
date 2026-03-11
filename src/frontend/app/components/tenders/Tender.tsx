import type { OpenTender } from '@/services/tender';

const difficultyMeta = {
  easy: {
    label: 'Kat.1',
    text: 'Kat.1 (einfach)',
    bar: 'bg-green-600',
    border: 'border-green-600',
    textColor: 'text-green-600',
  },
  medium: {
    label: 'Kat.2',
    text: 'Kat.2 (mittel)',
    bar: 'bg-yellow-600',
    border: 'border-yellow-600',
    textColor: 'text-yellow-600',
  },
  hard: {
    label: 'Kat.3',
    text: 'Kat.3 (schwer)',
    bar: 'bg-red-600',
    border: 'border-red-600',
    textColor: 'text-red-600',
  },
} as const;

/**
 * **Tender**
 * * Eine UI-Komponente zur Darstellung eines einzelnen Ausschreibungseintrags (Tender) in einer Liste.
 *
 * ### Funktionalitäten:
 * - **Visuelle Kategorisierung**: Verwendet farbige Indikatoren (Balken und Rahmen) basierend auf der Schwierigkeit (`easy`, `medium`, `hard`).
 * - **Routen-Formatierung**: Wandelt kommagetrennte Routen-Strings in ein lesbares Format um (z. B. "A - B - C").
 * - **Datumsformatierung**: Formatiert das Vertragsdatum lokalisiert für Deutschland (dd.mm.yyyy).
 *
 * ### Logik-Details:
 * - `routeLabel`: Verarbeitet den `tender.route` String. Entfernt Leerzeichen und filtert leere Segmente.
 * - `dateLabel`: Nutzt `toLocaleDateString`, um ein standardisiertes deutsches Datum zu erzeugen.
 * - `meta`: Greift auf `difficultyMeta` zu, um die Stil-Klassen dynamisch zuzuweisen.
 *
 * @param props - Die Eigenschaften der Komponente.
 * @param props.tender - Das Ausschreibungsobjekt vom Typ {@link OpenTender}.
 * * @example
 * ```tsx
 * <Tender tender={myOpenTenderObject} />
 * ```
 * * @category Components
 * @returns Ein React-Element, das die Ausschreibung in einer Card-Ansicht darstellt.
 */
export default function Tender({ tender }: { tender: OpenTender }) {
  const meta = difficultyMeta[tender.difficulty];
  const routeLabel = tender.route
    ? tender.route
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .join(' - ')
    : '—';
  const dateLabel = tender.contractStart
    ? tender.contractStart.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '—';

  return (
    <div className="relative mt-3 flex items-center justify-between gap-4 rounded-xl border border-gray-800 bg-[#0f1722] px-4 py-4 shadow-sm">
      <span
        className={`absolute top-0 left-0 h-full w-1.5 rounded-l-xl ${meta.bar}`}
        aria-hidden="true"
      />

      <div className="flex items-center gap-4 pl-3">
        <div
          className={`flex h-10 w-14 items-center justify-center rounded-md border-2 ${meta.border} ${meta.textColor} text-xs font-semibold`}
        >
          {meta.label}
        </div>

        <div>
          <div className="text-lg font-semibold text-gray-100 underline decoration-gray-500">
            {tender.name}
          </div>
          <div className="text-sm text-gray-400 italic">{routeLabel}</div>
        </div>
      </div>

      <div className="text-right text-xs text-gray-400">
        <div className="italic">offen bis: {dateLabel}</div>
        <div className="italic">{meta.text}</div>
      </div>
    </div>
  );
}
