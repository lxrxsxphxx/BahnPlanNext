import { useState } from "react";
import LeasingSuccessModal from "./wagen-leasen-success-modal";
import { useWagon } from './add-wagen';
import wagenData  from "../../routes/beschaffung.wagen";

interface Lok {
  id: number;
  traction_type: string;
  type_name: string;
  suitable_passenger_max_wagons: number;
  leasing_model: number;
}

interface Wagen {
  id: number;
  name: string;
  image: string;
  vmax?: number;
  [key: string]: any; 
}

interface WagenLeasenFormProps {
  wagen: Wagen;
  wagenId: number;
  wagenName: string;
  lokList: Lok[];
  lokAssignments: Record<number, number>; // key=lokId, value=wagenId
  assignedWagenCount: Record<number, number>; // key=lokId, value=zugewiesene Wagen
  onClose?: () => void;
  onLeasenSuccess?: (
    standardWagen: number,
    steuerWagen: number,
    lokId?: number
  ) => void;
  onLokAssignmentChange?: (
    lokAssignments: Record<number, number>,
    assignedWagenCount: Record<number, number>,
    geleasterWagen?: { id: number; name: string }
  ) => void;
}

export default function WagenLeasenForm({
  wagen,
  wagenId,
  wagenName,
  lokList,
  lokAssignments,
  assignedWagenCount,
  onClose,
  onLeasenSuccess,
  onLokAssignmentChange,
}: WagenLeasenFormProps) {
  const [selectedLokId, setSelectedLokId] = useState<number | undefined>(
    lokList.find(
      (lok) => !lokAssignments[lok.id] || lokAssignments[lok.id] === wagenId
    )?.id
  );
  const [standardWagen, setStandardWagen] = useState(1);
  const [steuerWagen, setSteuerWagen] = useState(1);

  const selectedLok = lokList.find((lok) => lok.id === selectedLokId);
  const gesamtWagen = selectedLok?.suitable_passenger_max_wagons || 0;
  const zugewieseneWagen = assignedWagenCount[selectedLokId ?? -1] || 0;

  const [selectedLokName, setSelectedLokName] = useState("");
  const [lieferDatum, setLieferDatum] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const gesamt = standardWagen + steuerWagen;

  const leasenKostenProWoche = gesamt * 125000;
  const leasenKostenProJahr = leasenKostenProWoche * 52;

  const { addWagon } = useWagon();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLokId) return;

    const newAssignments = { ...lokAssignments, [selectedLokId]: wagenId };
    const newAssignedCount = {
      ...assignedWagenCount,
      [selectedLokId]: zugewieseneWagen + gesamt,
    };

    onLokAssignmentChange?.(newAssignments, newAssignedCount);

    const today = new Date();
    const formattedDate = today.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    addWagon({ 
      ...wagen,
      assignedToLok: selectedLokId,
      standardCount: standardWagen,
      steuerCount: steuerWagen,
      leaseDate: formattedDate
    } as any); 

    setLieferDatum(formattedDate);
    setSelectedLokName(selectedLok ? `${selectedLok.traction_type} ${selectedLok.type_name} (ID: ${selectedLok.id})` : "-");

    setShowSuccess(true);

    onLeasenSuccess?.(standardWagen, steuerWagen, selectedLokId);

  };

  const maxWagen = gesamtWagen - zugewieseneWagen;

  const modelle = [
    {
      id: 1,
      name: "Modell 1",
      jaehrlich: "0 %",
      wochenrate: "0,30 %",
      zahlung: "jährlich im Voraus",
      kuendigung: "nach 6 Wochen, 25.000 € (entfällt nach 365 Tagen)",
    },
    {
      id: 2,
      name: "Modell 2",
      jaehrlich: "5 %",
      wochenrate: "0,18 %",
      zahlung: "jährlich im Voraus",
      kuendigung: "nach 6 Wochen, 25.000 € (entfällt nach 365 Tagen)",
    },
    {
      id: 3,
      name: "Modell 3",
      jaehrlich: "10 %",
      wochenrate: "0,06 %",
      zahlung: "jährlich im Voraus",
      kuendigung: "nach 6 Wochen, 25.000 € (entfällt nach 365 Tagen)",
    },
    {
      id: 4,
      name: "Modell 4",
      jaehrlich: "0 %",
      wochenrate: "0,33 %",
      zahlung: "jährlich im Voraus",
      kuendigung: "jederzeit, keine Sperrfrist/keine Kündigungsgebühr",
    },
  ];

  const selectedModel = modelle.find((m) => m.id === selectedLok?.leasing_model);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-[#121C27] p-8 shadow-xl animate-scaleIn text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center text-3xl font-semibold text-gray-200 italic mb-6">
          {wagenName} leasen
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-row gap-4 items-stretch">
            {/* linke Spalte */}
            <div className="flex-1 min-w-0 space-y-4 p-2">
              {/* Lokomotiv wählen */}
              <div className="space-y-3 bg-[#1D2840]/60 p-5 rounded-lg">
                <h3 className="font-semibold text-gray-300 mb-2">
                  Lokomotiv wählen:
                </h3>
                <select
                  className="w-full bg-[#0A111C] text-white p-2 rounded border border-[#223041]"
                  value={selectedLokId}
                  onChange={(e) => setSelectedLokId(Number(e.target.value))}
                >
                  {lokList
                    .filter(
                      (lok) =>
                        !lokAssignments[lok.id] ||
                        lokAssignments[lok.id] === wagenId
                    )
                    .map((lok) => (
                      <option key={lok.id} value={lok.id}>
                        {lok.traction_type}: {lok.type_name} (ID: {lok.id})
                      </option>
                    ))}
                </select>

                <div className="flex justify-between mt-3">
                  {/* Standardwagen */}
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-gray-400 font-semibold">
                      Standardwagen:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setStandardWagen(Math.max(0, standardWagen - 1))
                        }
                        disabled={standardWagen <= 0}
                        className={`w-6 h-6 flex items-center justify-center rounded-full font-bold ${
                          standardWagen <= 0
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-[#783A32] hover:bg-[#994337]"
                        } text-white`}
                      >
                        -
                      </button>

                      <input
                        type="number"
                        value={standardWagen}
                        onChange={(e) => {
                          let val = parseInt(e.target.value) || 0;
                          if (val + steuerWagen > maxWagen)
                            val = Math.max(maxWagen - steuerWagen, 0);
                          setStandardWagen(val);
                        }}
                        className="w-12 text-center rounded bg-[#0A111C] border border-[#223041] text-white"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setStandardWagen(
                            Math.min(maxWagen - steuerWagen, standardWagen + 1)
                          )
                        }
                        disabled={standardWagen + steuerWagen >= maxWagen}
                        className={`w-6 h-6 flex items-center justify-center rounded-full font-bold ${
                          standardWagen + steuerWagen >= maxWagen
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-[#3D7041] hover:bg-[#3E9548]"
                        } text-white`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Steuerwagen */}
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-gray-400 font-semibold">
                      Steuerwagen:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSteuerWagen(Math.max(0, steuerWagen - 1))
                        }
                        disabled={steuerWagen <= 0}
                        className={`w-6 h-6 flex items-center justify-center rounded-full font-bold ${
                          steuerWagen <= 0
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-[#783A32] hover:bg-[#994337]"
                        } text-white`}
                      >
                        -
                      </button>

                      <input
                        type="number"
                        value={steuerWagen}
                        onChange={(e) => {
                          let val = parseInt(e.target.value) || 0;
                          if (val + standardWagen > maxWagen)
                            val = Math.max(maxWagen - standardWagen, 0);
                          setSteuerWagen(val);
                        }}
                        className="w-12 text-center rounded bg-[#0A111C] border border-[#223041] text-white"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setSteuerWagen(
                            Math.min(maxWagen - standardWagen, steuerWagen + 1)
                          )
                        }
                        disabled={steuerWagen + standardWagen >= maxWagen}
                        className={`w-6 h-6 flex items-center justify-center rounded-full font-bold ${
                          steuerWagen + standardWagen >= maxWagen
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-[#3D7041] hover:bg-[#3E9548]"
                        } text-white`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Fortschrittsanzeige */}
                <div className="text-gray-400 text-sm mt-2">
                  Zugewiesene Wagen: {Math.min(zugewieseneWagen + gesamt, gesamtWagen)}/{gesamtWagen}
                  <div className="w-full h-2 bg-[#223041] rounded mt-1">
                    <div
                      className="h-2 bg-[#235364] rounded"
                      style={{
                        width: `${(Math.min(zugewieseneWagen + gesamt, gesamtWagen) / gesamtWagen) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Leasing-Überblick */}
              <div className="min-w-0 space-y-1 bg-[#1D2840]/60 p-5 rounded-lg">
                <h3 className="font-semibold text-gray-300 mb-2">
                  Leasing-Überblick:
                </h3>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Gesamtmenge:</span>
                  <span>{gesamt} Wagen</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Leasenkosten pro Woche:</span>
                  <span>
                    {leasenKostenProWoche.toLocaleString("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Leasenkosten pro Jahr:</span>
                  <span>
                    {leasenKostenProJahr.toLocaleString("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* rechte Spalte */}
            <div className="flex-1 min-w-0 space-y-1 p-5 pr-0 bg-[#1D2840]/60 rounded-lg">
              <h3 className="font-semibold text-gray-300 mb-2">
                Leasing-Konfiguration:
              </h3>
              <ul className="list-disc list-inside text-gray-400 text-sm pr-2">
                <div>
                  Leasingmodell: <span className="font-bold">{selectedModel?.name || '-'}</span>
                </div>
                <div><li> Jährlich: {selectedModel?.jaehrlich}</li></div>
                <div><li> Wochenrate: {selectedModel?.wochenrate}</li></div>
                <div><li> Zahlung: {selectedModel?.zahlung}</li></div>
                <div><li> Kündigung: {selectedModel?.kuendigung}</li></div>
              </ul>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm font-semibold bg-[#783A32] rounded-xl hover:bg-red-800"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 py-2 text-sm font-semibold bg-[#3D7041] rounded-xl hover:bg-green-700"
            >
              Bestätigen
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <LeasingSuccessModal
          wagenName={wagenName}
          lokName={selectedLokName}
          standardWagen={standardWagen}
          steuerWagen={steuerWagen}
          lieferDatum={lieferDatum}
          onClose={() => {
            setShowSuccess(false);
            onClose?.();
          }}
        />
      )}
    </div>
  );
}
