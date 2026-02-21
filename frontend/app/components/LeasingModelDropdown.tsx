import { useState } from 'react';

import type { Modell } from '@/routes/beschaffung.loks';

interface LeasingModelDropdownProps {
  modelle: Modell[];
  selectedModel: Modell | null;
  setSelectedModel: React.Dispatch<React.SetStateAction<Modell | null>>;
}

/**
 * **LeasingModelDropdown**
 * * Eine spezialisierte Dropdown-Komponente zur Auswahl von Leasing-Konditionen für Lokomotiven.
 * * ### Funktionalitäten
 * - **Interaktive Auswahl**: Öffnet eine Liste aller verfügbaren {@link Modell}-Optionen.
 * - **Dynamische Tooltips**: Beim Hovern über eine Option erscheint ein seitliches Informationsfenster mit Details zu Raten, Zahlungszyklen und Kündigungsfristen.
 * - **Zustandsanzeige**: Zeigt den Namen des aktuell gewählten Modells im Button-Label an.
 * - **Z-Index Management**: Nutzt `z-10` und `z-20`, um sicherzustellen, dass das Dropdown und die Tooltips über anderen UI-Elementen schweben.
 * * ### Interner Status (State)
 * | State | Typ | Beschreibung |
 * | :--- | :--- | :--- |
 * | `isOpen` | `boolean` | Steuert, ob das Dropdown-Menü ausgeklappt ist. |
 * | `hoveredIndex` | `number \| null` | Hält den Index der Option, über der sich der Mauszeiger befindet, um den passenden Tooltip anzuzeigen. |
 * * ### UI-Struktur
 * 1. **Trigger-Button**: Wechselt den `isOpen` Status.
 * 2. **Info-Tooltip**: Erscheint rechts neben der Liste bei Hover.
 * * @param props - Die Konfigurationsobjekte der Komponente.
 * @returns Ein funktionales React-Element (Dropdown mit Tooltips).
 * * @category Components
 * @example
 * ```tsx
 * <LeasingModelDropdown
 * modelle={leasingDaten}
 * selectedModel={choice}
 * setSelectedModel={setChoice}
 * />
 * ```
 */
export function LeasingModelDropdown({
  modelle,
  selectedModel,
  setSelectedModel,
}: LeasingModelDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  /** Trackt die aktuell gehoverte Option für die Tooltip-Anzeige. @internal */
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:cursor-pointer hover:bg-gray-900"
      >
        {selectedModel ? selectedModel.name : 'Leasingmodelle'}{' '}
        {isOpen ? '\u25B2' : '\u25BC'}
      </button>

      {/* Ausklappbare Liste */}
      {isOpen && (
        <div className="absolute top-full left-0 z-10 mt-2 w-56 rounded-md border border-gray-600 bg-gray-800 shadow-lg">
          {modelle.map((modell, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                onClick={() => {
                  setSelectedModel(modell);
                  setIsOpen(false);
                }}
                className="cursor-pointer border-b border-gray-700 px-4 py-3 text-sm text-white transition-colors last:border-b-0 hover:bg-gray-700"
              >
                {modell.name}
              </div>

              {/* Tooltip */}
              {hoveredIndex === index && (
                <div className="pointer-events-none absolute top-0 left-full z-20 ml-2 w-56 rounded-md border border-blue-500/50 bg-gray-800 p-3 shadow-lg">
                  <div className="space-y-1 text-xs text-gray-300">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-400">
                        Jährlich:
                      </span>
                      <span className="text-white">{modell.jaehrlich}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-400">
                        Wöchentlich:
                      </span>
                      <span className="text-white">{modell.wochenrate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-400">
                        Zahlung:
                      </span>
                      <span className="text-white">{modell.zahlung}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-400">
                        Kündigung:
                      </span>
                      <span className="text-white">{modell.kuendigung}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
