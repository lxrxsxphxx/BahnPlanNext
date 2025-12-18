import { useState } from 'react';

interface Modell {
  name: string;
  Leasingdauer: string;
  Anzahlung: string;
  Monatsrate: string;
}

interface LeasingModelDropdownProps {
  modelle: Modell[];
}

export function LeasingModelDropdown({ modelle }: LeasingModelDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-colors hover:cursor-pointer"
      >
        {isOpen ? 'Leasingmodelle \u25B2' : 'Leasingmodelle \u25BC'}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 rounded-md border border-gray-600 bg-gray-800 shadow-lg z-10">
          {modelle.map((modell, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="px-4 py-3 text-sm text-white hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0">
                {modell.name}
              </div>

              {/* Tooltip */}
              {hoveredIndex === index && (
                <div className="absolute left-full top-0 ml-2 w-56 rounded-md border border-blue-500/50 bg-gray-800 p-3 shadow-lg pointer-events-none z-20">
                  <div className="text-xs text-gray-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-400">Leasingdauer:</span>
                      <span className="text-white">{modell.Leasingdauer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-400">Anzahlung:</span>
                      <span className="text-white">{modell.Anzahlung}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-400">Monatsrate:</span>
                      <span className="text-white">{modell.Monatsrate}</span>
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
