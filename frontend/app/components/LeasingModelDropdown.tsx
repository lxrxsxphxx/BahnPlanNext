import { useState } from 'react';

import type { Modell } from '@/routes/beschaffung.loks';

interface LeasingModelDropdownProps {
  modelle: Modell[];
  selectedModel: Modell | null;
  setSelectedModel: React.Dispatch<React.SetStateAction<Modell | null>>;
}

export function LeasingModelDropdown({ modelle, selectedModel, setSelectedModel }: LeasingModelDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-colors hover:cursor-pointer"
      >
        {selectedModel ? selectedModel.name : 'Leasingmodelle'} {isOpen ? '\u25B2' : '\u25BC'}
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
              <div 
                onClick={() => {
                  setSelectedModel(modell);
                  setIsOpen(false);
                }}
                className="px-4 py-3 text-sm text-white hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0"
              >
                {modell.name}
              </div>

              {/* Tooltip */}
              {hoveredIndex === index && (
                <div className="absolute left-full top-0 ml-2 w-56 rounded-md border border-blue-500/50 bg-gray-800 p-3 shadow-lg pointer-events-none z-20">
                  <div className="text-xs text-gray-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-400">Jährlich:</span>
                      <span className="text-white">{modell.jaehrlich}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-400">Wöchentlich:</span>
                      <span className="text-white">{modell.wochenrate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-400">Zahlung:</span>
                      <span className="text-white">{modell.zahlung}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-400">Kündigung:</span>
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
