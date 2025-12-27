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
    <div key={lok.name} className="rounded-2xl border border-blue-500/50 bg-gray-800 p-6">
                <h2 className="mb-4 text-xl font-semibold">{lok.name}</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Bild */}
                  <div>
                    <div className="overflow-hidden rounded-md border border-gray-700">
                      <img src={lok.image} alt={lok.name} className="h-103 w-full object-cover" />
                    </div>
                  </div>
    
                  {/* Spezifikationstabelle und Dropdown */}
                  <div className="md:col-span-2 flex gap-4">
                    <div className="max-w-full rounded-md border border-gray-700 p-4">
                      <table className="w-full text-sm">
                        <tbody>
                          {[...lok.specsLeft, ...lok.specsRight].map((row) => (
                            <div>
                                <tr key={row.label}>
                                <td className="py-1 text-gray-300 pr-5">{row.label}:</td>
                                <td className="py-1 text-gray-100">{row.value}</td>
                                </tr>
                                <hr />
                            </div>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="w-64  p-4">
                      {lok.action.type === 'leasing' ? (
                        <div>
                          <LeasingModelDropdown 
                            modelle={lok.modelle} 
                            selectedModel={selectedModel} 
                            setSelectedModel={setSelectedModel} 
                          />
                          {selectedModel && <button className='mt-20 w-56 text-center bg-blue-500 rounded-4xl pl-10 pr-10 py-2 text-sm font-medium hover:bg-blue-600 hover:cursor-pointer'
                          onClick={handleLeasing}
                          >
                            Leasing
                            </button>}
                        </div>
                      ) : (
                        <button className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-600">
                          {lok.action.label}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
  )
}