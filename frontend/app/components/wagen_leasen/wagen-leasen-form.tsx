import { useState } from 'react';

interface WagenLeasenFormProps {
  wagenName: string;
  onClose?: () => void;
  onLeasenSuccess?: (standardWagen: number, steuerWagen: number) => void;
}

export default function WagenLeasenForm({ wagenName, onClose, onLeasenSuccess }: WagenLeasenFormProps) {
  const [standardWagen, setStandardWagen] = useState(1);
  const [steuerWagen, setSteuerWagen] = useState(1);

  const gesamt = standardWagen + steuerWagen;
  const leasenKosten = gesamt * 125000; // Beispielkosten pro Wagen

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLeasenSuccess?.(standardWagen, steuerWagen);
  };

  return (
    // Hintergrund-Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fadeIn"
      onClick={onClose} // Klick auf Hintergrund -> Modal schließen
    >
      {/* Modal selbst */}
      <div
        className="relative text-white animate-scaleIn w-full max-w-sm rounded-2xl bg-[#121C27] p-12 shadow-xl"
        onClick={(e) => e.stopPropagation()} // Klick im Modal selbst -> Event nicht weitergeben
      >
        <h2 className="mt-2 mb-5 text-center text-3xl font-semibold italic text-gray-200">
          {wagenName} leasen
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <label className="font-semi text-gray-400 mb-1 text-[17px] ">Standardwagen:</label>
            <div className="flex items-center gap-2 bg-[#0A111C] border border-[#223041] rounded-lg px-2 py-1">
              <button
                type="button"
                onClick={() => setStandardWagen(Math.max(0, standardWagen - 1))}
                className="text-[#994337] px-2 py-1 font-bold hover:bg-[#2A1B1B]"
              >
                -
              </button>
              <span>{standardWagen}</span>
              <button
                type="button"
                onClick={() => setStandardWagen(standardWagen + 1)}
                className="text-[#3E9548] px-2 py-1 font-bold hover:bg-[#1E2A1B]"            
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="font-semi text-gray-400 mb-1 text-[17px]">Steuerwagen:</label>
            <div className="flex items-center gap-2 bg-[#0A111C] border border-[#223041] rounded-lg px-2 py-1">
              <button
                type="button"
                onClick={() => setSteuerWagen(Math.max(0, steuerWagen - 1))}
                className="text-[#994337] px-2 py-1 font-bold hover:bg-[#2A1B1B]"
              >
                -
              </button>
              <span>{steuerWagen}</span>
              <button
                type="button"
                onClick={() => setSteuerWagen(steuerWagen + 1)}
                className="text-[#3E9548] px-2 py-1 font-bold hover:bg-[#1E2A1B]"
              >
                +
              </button>
            </div>
          </div>

          <hr className="border-gray-600" />

          <div className="flex justify-between text-[15px] font-medium text-gray-400">
            <span>Gesamtmenge:</span>
            <span>{gesamt} Wagen</span>
          </div>

          <div className="flex justify-between text-[15px] font-medium text-gray-400">
            <span>Leasenkosten pro Woche:</span>
            <span>{leasenKosten.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              className="flex-1 rounded-xl bg-[#783A32] py-1 font-semibold hover:bg-red-800 text-[15px]"
              onClick={() => onClose?.()}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-[#3D7041] py-3 font-semibold hover:bg-green-700 text-[15px]"
            >
              Bestätigen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
