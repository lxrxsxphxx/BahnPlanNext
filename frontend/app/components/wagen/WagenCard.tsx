import { useState } from "react";
import WagenLeasenForm from "./wagen-leasen-form";

export interface Wagen {
  id: number;
  name: string;
  image: string;
  vmax: number;
  preisStandard: number;
  preisSteuer: number;
  kostenKm: number;
  kapazitaet: number;
  assignedToLok?: number;
  standardCount?: number;
  steuerCount?: number;
  leaseDate?: string;
}

interface Lok {
  id: number;
  traction_type: string;
  type_name: string;
  suitable_passenger_max_wagons: number;
  leasing_model: number;
}

interface WagenCardProps {
  wagen: Wagen;
  cashBalance: number;
  lokList: Lok[];
  lokAssignments: Record<number, number>;
  assignedWagenCount: Record<number, number>;
  onLokAssignmentChange?: (
    lokAssignments: Record<number, number>,
    assignedWagenCount: Record<number, number>
  ) => void;
}

export default function WagenCard({
  wagen,
  cashBalance,
  lokList,
  lokAssignments,
  assignedWagenCount,
  onLokAssignmentChange,
}: WagenCardProps) {
  const [leasingOpen, setLeasingOpen] = useState(false);

  const specs = [
    { label: "Höchstgeschwindigkeit", value: `${wagen.vmax} km/h` },
    { label: "Neupreis Standardwagen", value: `${wagen.preisStandard.toLocaleString("de-DE")} €` },
    { label: "Neupreis Steuerwagen", value: `${wagen.preisSteuer.toLocaleString("de-DE")} €` },
    { label: "Kilometerkosten", value: `${wagen.kostenKm} €/km` },
    { label: "Kapazität", value: `${wagen.kapazitaet} Personen` },
  ];

  return (
    <>
      <div className="flex justify-center">
        <div className="rounded-2xl border border-blue-500/50 bg-gray-800 p-7 w-full max-w-400">
          <h2 className="mb-4 text-xl font-semibold text-center">{wagen.name}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="overflow-hidden rounded-md">
              <img
                src={wagen.image}
                alt={wagen.name}
                className="w-full max-h-45 object-contain"
              />
            </div>

            <div className="md:col-span-2 flex items-start gap-4">
              <div className="p-4 border border-gray-700 rounded-md flex-1 max-w-120">
                <table className="w-full text-sm">
                  <tbody>
                    {specs.map((row) => (
                      <tr key={row.label} className="border-b border-gray-700 last:border-b-0">
                        <td className="w-48 py-1 pr-5 text-gray-300">{row.label}:</td>
                        <td className="py-1 text-gray-100">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex-shrink-0 flex justify-center items-center pt-18 pl-8">
                <button
                  className="w-36 py-1.5 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600"
                  onClick={() => setLeasingOpen(true)}
                >
                  Leasing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {leasingOpen && (
        <WagenLeasenForm
          wagen={wagen}
          wagenId={wagen.id}
          wagenName={wagen.name}
          lokList={lokList}
          lokAssignments={lokAssignments}
          assignedWagenCount={assignedWagenCount}
          onClose={() => setLeasingOpen(false)}
          onLokAssignmentChange={onLokAssignmentChange}
        />
      )}
    </>
  );
}
