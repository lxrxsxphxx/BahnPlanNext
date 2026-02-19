import type { Wagen } from "./WagenCard";

interface WagonListProps {
  wagons: Wagen[];
}

export default function WagonList({ wagons }: WagonListProps) {
  const groupedWagons = wagons.reduce((acc, current) => {
    const key = current.name;
    if (!acc[key]) {
      acc[key] = {
        info: current, 
        assignments: [] 
      };
    }
    acc[key].assignments.push({
      lokId: current.assignedToLok,
      count: (current.standardCount || 0) + (current.steuerCount || 0)
    });
    return acc;
  }, {} as Record<string, { info: Wagen; assignments: { lokId: any; count: number }[] }>);

  const groupedArray = Object.values(groupedWagons);

  return (
    <div className="mt-6 space-y-6">

      {groupedArray.length === 0 ? (
        <div className="p-10 text-center bg-[#121C27] rounded-2xl border border-dashed border-gray-700">
          <p className="text-gray-400 italic">Du hast noch keine Wagen geleast.</p>
        </div>
      ) : (
        groupedArray.map((group, index) => (
          <div key={`${group.info.name}-${index}`} className="bg-[#121C27] border border-[#223041] rounded-xl overflow-hidden shadow-2xl">
            
            {/* Header */}
            <div className="bg-[#1D2840]/40 px-6 py-2 border-b border-[#223041]">
              <h3 className="text-lg font-bold italic text-gray-200 tracking-wide">
                {group.info.name}
              </h3>
            </div>

            <div className="p-5 flex flex-col lg:flex-row gap-6 items-start">
              {/* Bilder */}
              <div className="w-full lg:w-72 shrink-0">
                <div className="aspect-video rounded-lg overflow-hidden border border-gray-800 bg-black/20">
                  <img 
                    src={group.info.image} 
                    alt={group.info.name} 
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              </div>

              {/* Zuweisung */}
              <div className="flex-1 w-full space-y-3">
                {group.assignments.map((assign, aIdx) => (
                  <div key={aIdx} className="relative pl-4 border-l-2 border-blue-500/30 py-1">
                    <div className="flex items-center gap-6">
                      <div className="text-sm text-gray-400 italic min-w-[80px]">
                        Anzahl: <span className="text-gray-200 font-bold">{assign.count}</span>
                      </div>

                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>

                      <div className="flex items-center gap-3 bg-[#0A111C] px-3 py-1.5 rounded border border-[#233145]">
                        <div className="w-10 h-6 bg-red-800/80 rounded flex items-center justify-center">
                           <span className="text-[9px] font-black text-white">LOK</span>
                        </div>
                        <span className="text-lg font-black italic tracking-tighter text-gray-100">
                          101 -{String(assign.lokId).padStart(3, '0')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Specs */}
              <div className="w-full lg:w-80 bg-[#0A111C]/40 p-4 rounded-lg border border-[#223041]/50">
                <table className="w-full text-[11px] leading-relaxed">
                  <tbody className="text-gray-400 italic">
                    <tr>
                      <td className="py-1">Höchstgeschwindigkeit:</td>
                      <td className="py-1 text-right text-gray-200 font-medium">{group.info.vmax} km/h</td>
                    </tr>
                    <tr>
                      <td className="py-1">Neupreis Standardwagen:</td>
                      <td className="py-1 text-right text-gray-200 font-medium">{group.info.preisStandard?.toLocaleString('de-DE')} €</td>
                    </tr>
                    <tr>
                      <td className="py-1">Neupreis Steuerwagen:</td>
                      <td className="py-1 text-right text-gray-200 font-medium">{group.info.preisSteuer?.toLocaleString('de-DE')} €</td>
                    </tr>
                    <tr>
                      <td className="py-1">Kilometerkosten (alle Arten):</td>
                      <td className="py-1 text-right text-gray-200 font-medium">{group.info.kostenKm?.toFixed(2)} €/km</td>
                    </tr>
                    <tr>
                      <td className="py-1">Kapazität (alle Arten):</td>
                      <td className="py-1 text-right text-gray-200 font-medium">{group.info.kapazitaet} Personen</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}