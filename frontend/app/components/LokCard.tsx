import type { Modell } from "@/routes/beschaffung.loks";
import { LeasingModelDropdown } from "./LeasingModelDropdown";
import { useState } from "react";

interface Lok{
    name: string;
    image: string;
    specsLeft: { label: string; value: string }[];
    specsRight: { label: string; value: string }[];
    action: { type: 'leasing' | 'kauf'; label: string };
    modelle: Modell[];
}

interface LokCardProps {
  lok: Lok;
}

export default function LokCard({ lok }: LokCardProps) {
    const [selectedModel, setSelectedModel] = useState<Modell | null>(null);
    
    const handleLeasing = () => {
      alert('Leasing abgeschlossen! Folgendes Modell wurde ausgewählt: ' + JSON.stringify(selectedModel));
    }
    
  return (
    <div key={lok.name} className="rounded-2xl border border-[#223041] bg-[#121C27] px-10 py-6">
            <h2 className="mb-4 text-xl font-semibold">{lok.name}</h2>

            {/* Grid responsive */}
            <div className="grid grid-cols-1 md:grid-cols-[min-content_auto_auto] gap-6 items-start">
              
              {/* Bild */}
              <div>
                <div className="overflow-hidden rounded-md border border-gray-700 h-80 w-110">
                  <img src={lok.image} alt={lok.name} className="block h-80 w-110 object-cover" />
                </div>
              </div>

              {/* Spezifikationstabelle */}
              <div className="max-w-full bg-[#101822] rounded-md border border-gray-700 p-4">
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    {[...lok.specsLeft, ...lok.specsRight].map((row, index, arr) => (
                      <tr
                        key={row.label}
                        className={index < arr.length - 1 ? "border-b border-[#314358]" : ""}
                      >
                        <td className="py-1 text-gray-300 pr-5">{row.label}:</td>
                        <td className="py-1 text-gray-100">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Dropdown + button */}
              <div className="flex flex-col items-center md:items-start w-full md:w-64 p-4">
                {lok.action.type === 'leasing' ? (
                  <div>
                    <LeasingModelDropdown 
                      modelle={lok.modelle} 
                      selectedModel={selectedModel} 
                      setSelectedModel={setSelectedModel} 
                    />
                    {selectedModel && (
                      <button 
                        className="mt-4 w-full md:w-56 text-center bg-[#346092] rounded-4xl py-2 text-sm font-medium hover:bg-[#3673B8] hover:cursor-pointer"
                        onClick={handleLeasing}
                      >
                        Leasing
                      </button>
                    )}
                  </div>
                ) : (
                  <button className="w-full md:w-auto rounded-md bg-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-600">
                    {lok.action.label}
                  </button>
                )}
              </div>

            </div>
          </div>
  )
}
