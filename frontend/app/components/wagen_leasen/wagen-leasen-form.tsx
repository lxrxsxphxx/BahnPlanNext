import { useState } from "react";

interface WagenLeasenFormProps {
  wagenName: string;
  onClose?: () => void;
  onLeasenSuccess?: (standardWagen: number, steuerWagen: number) => void;
}

export default function WagenLeasenForm({
  wagenName,
  onClose,
  onLeasenSuccess,
}: WagenLeasenFormProps) {
  const [standardWagen, setStandardWagen] = useState(1);
  const [steuerWagen, setSteuerWagen] = useState(1);

  const gesamt = standardWagen + steuerWagen;
  const leasenKostenProWoche = gesamt * 125000; // Beispielwert
  const leasenKostenProJahr = leasenKostenProWoche * 52;
  const zugewieseneWagen = 4; // Beispiel
  const gesamtWagen = 12; // Beispiel

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLeasenSuccess?.(standardWagen, steuerWagen);
  };

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
          {/* main container */}
          <div className="flex flex-row gap-4 items-stretch">
            {/* linke Spalte: Lokomotiv + Wagen + Leasing-Konfiguration */}
            <div className="flex-1 min-w-0 space-y-4 p-2">
              {/* 1. Lokomotiv wählen */}
              <div className="space-y-3 bg-[#1D2840]/60 p-5 rounded-lg">
                <h3 className="font-semibold text-gray-300 mb-2">Lokomotiv wählen:</h3>
                <select className="w-full bg-[#0A111C] text-white p-2 rounded border border-[#223041]">
                  <option>Elektrolokomotive: BR 101 (ID: 001)</option>
                  <option>Elektrolokomotive: BR 101 (ID: 002)</option>
                </select>

                <div className="flex justify-between mt-3">
                {/* Standardwagen */}
                <div className="flex flex-col items-start gap-1">
                  <span className="text-gray-400 font-semibold">Standardwagen:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStandardWagen(Math.max(0, standardWagen - 1))}
                      disabled={standardWagen <= 0}
                      className={`w-6 h-6 flex items-center justify-center rounded-full font-bold ${
                        standardWagen <= 0 ? "bg-gray-600 cursor-not-allowed" : "bg-[#783A32] hover:bg-[#994337]"
                      } text-white`}
                    >
                      -
                    </button>

                    <input
                      type="number"
                      value={standardWagen}
                      onChange={(e) => {
                        let val = parseInt(e.target.value) || 0;
                        if (val + steuerWagen > gesamtWagen) val = gesamtWagen - steuerWagen;
                        setStandardWagen(val);
                      }}
                      className="w-12 text-center rounded bg-[#0A111C] border border-[#223041] text-white"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setStandardWagen(Math.min(gesamtWagen - steuerWagen, standardWagen + 1))
                      }
                      disabled={standardWagen + steuerWagen >= gesamtWagen}
                      className={`w-6 h-6 flex items-center justify-center rounded-full font-bold ${
                        standardWagen + steuerWagen >= gesamtWagen
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
                  <span className="text-gray-400 font-semibold">Steuerwagen:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSteuerWagen(Math.max(0, steuerWagen - 1))}
                      disabled={steuerWagen <= 0}
                      className={`w-6 h-6 flex items-center justify-center rounded-full font-bold ${
                        steuerWagen <= 0 ? "bg-gray-600 cursor-not-allowed" : "bg-[#783A32] hover:bg-[#994337]"
                      } text-white`}
                    >
                      -
                    </button>

                    <input
                      type="number"
                      value={steuerWagen}
                      onChange={(e) => {
                        let val = parseInt(e.target.value) || 0;
                        if (val + standardWagen > gesamtWagen) val = gesamtWagen - standardWagen;
                        setSteuerWagen(val);
                      }}
                      className="w-12 text-center rounded bg-[#0A111C] border border-[#223041] text-white"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setSteuerWagen(Math.min(gesamtWagen - standardWagen, steuerWagen + 1))
                      }
                      disabled={steuerWagen + standardWagen >= gesamtWagen}
                      className={`w-6 h-6 flex items-center justify-center rounded-full font-bold ${
                        steuerWagen + standardWagen >= gesamtWagen
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
                Zugewiesene Wagen: {standardWagen + steuerWagen}/{gesamtWagen}
                <div className="w-full h-2 bg-[#223041] rounded mt-1">
                  <div
                    className="h-2 bg-[#235364] rounded"
                    style={{ width: `${((standardWagen + steuerWagen) / gesamtWagen) * 100}%` }}
                  ></div>
                </div>
              </div>
              </div>

              {/* 2. Leasing-Überblick  */}
              <div className=" min-w-0 space-y-1 bg-[#1D2840]/60 p-5 rounded-lg">
              <h3 className="font-semibold text-gray-300 mb-2">Leasing-Überblick:</h3>
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

            {/* rechte Spalte: Leasing-Konfiguration */}
              <div className="flex-1 min-w-0 space-y-1 p-5 pr-0 bg-[#1D2840]/60 rounded-lg">
                <h3 className="font-semibold text-gray-300 mb-2">Leasing-Konfiguration:</h3>
                <ul className="list-disc list-inside text-gray-400 text-sm">
                  <li>Leasingmodell: <span className="font-bold">Modell 1</span></li>
                  <li>0 % jährlich, 0,30 % wöchentlich vom Fahrzeugwert bei Vertragsbeginn</li>
                  <li>Kündigung ab 6 Wochen gegen 25.000 €, nach 1 Jahr kostenfrei</li>
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
    </div>
  );
}
