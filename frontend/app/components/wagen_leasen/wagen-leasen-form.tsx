import { useState } from 'react';

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
  const leasenKosten = gesamt * 125000; // Beispielkosten pro Wagen

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLeasenSuccess?.(standardWagen, steuerWagen);
  };

  return (
    // Hintergrund-Overlay
    <div
      className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose} // Klick auf Hintergrund -> Modal schließen
    >
      {/* Modal selbst */}
      <div
        className="animate-scaleIn relative w-full max-w-sm rounded-2xl bg-[#121C27] p-12 text-white shadow-xl"
        onClick={(e) => e.stopPropagation()} // Klick im Modal selbst -> Event nicht weitergeben
      >
        {/* TITLE */}
        <h2 className="mt-2 mb-5 text-center text-3xl font-semibold text-gray-200 italic">
          {wagenName} leasen
        </h2>
        {/* CONTENT */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <label className="font-semi mb-1 text-[17px] text-gray-400">
              Standardwagen:
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-[#223041] bg-[#0A111C] px-2 py-1">
              <button
                type="button"
                onClick={() => setStandardWagen(Math.max(0, standardWagen - 1))}
                className="px-2 py-1 font-bold text-[#994337] hover:bg-[#2A1B1B]"
              >
                -
              </button>
              <span>{standardWagen}</span>
              <button
                type="button"
                onClick={() => setStandardWagen(standardWagen + 1)}
                className="px-2 py-1 font-bold text-[#3E9548] hover:bg-[#1E2A1B]"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="font-semi mb-1 text-[17px] text-gray-400">
              Steuerwagen:
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-[#223041] bg-[#0A111C] px-2 py-1">
              <button
                type="button"
                onClick={() => setSteuerWagen(Math.max(0, steuerWagen - 1))}
                className="px-2 py-1 font-bold text-[#994337] hover:bg-[#2A1B1B]"
              >
                -
              </button>
              <span>{steuerWagen}</span>
              <button
                type="button"
                onClick={() => setSteuerWagen(steuerWagen + 1)}
                className="px-2 py-1 font-bold text-[#3E9548] hover:bg-[#1E2A1B]"
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
            <span>
              {leasenKosten.toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR',
              })}
            </span>
          </div>

          {/* BUTTONS */}
          <div className="mt-6 flex gap-4">
            <button
              type="button"
              className="flex-1 rounded-xl bg-[#783A32] py-1 text-[15px] font-semibold hover:bg-red-800"
              onClick={() => onClose?.()}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-[#3D7041] py-3 text-[15px] font-semibold hover:bg-green-700"
            >
              Bestätigen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
