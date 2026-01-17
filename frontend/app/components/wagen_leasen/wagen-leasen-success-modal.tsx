interface LeasingSuccessModalProps {
  wagenName: string;
  standardWagen: number;
  steuerWagen: number;
  onClose: () => void;
}

export default function LeasingSuccessModal({
  wagenName,
  standardWagen,
  steuerWagen,
  onClose,
}: LeasingSuccessModalProps) {
  return (
    // Hintergrund-Overlay klickbar
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fadeIn"
      onClick={onClose} // Klick auf Hintergrund -> Modal schließen
    >
      {/* Modal selbst */}
      <div
        className="w-full max-w-sm rounded-2xl bg-[#121C27] p-8 text-white shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()} // Klick innerhalb Modal -> Event nicht weitergeben
      >
        {/* ICON */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-green-500/80">
            <svg
              className="h-10 w-10 text-[#3E9548]"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* TITLE */}
        <h2 className="mt-4 text-center text-3xl font-semibold italic text-gray-200">
          Wagen geleast!
        </h2>

        <hr className="my-3 border-gray-700" />

        {/* CONTENT */}
        <div className="space-y-2 text-sm text-gray-300">
          <div>
            <p className="font-semibold text-gray-200 mb-1 text-[17px] ml-5">Wagen-Informationen:</p>
            <ul className="list-disc list-inside text-[15px] ml-5">
              <li>{wagenName}: Standard (x{standardWagen}), Stwg. (x{steuerWagen})</li>
              <li>
                Status: <span className="text-red-400 font-medium">in Lieferung</span>
              </li>
            </ul>
          </div>

          <hr className="my-3 border-gray-700" />

          <div>
            <p className="font-semibold text-gray-200 mb-1 text-[17px] ml-5">Lieferinformationen:</p>
            <ul className="list-disc list-inside text-[15px] ml-5">
              <li>Lieferdatum: 03.01.2026</li>
              <li>Leasingkosten werden ab Lieferdatum abgezogen</li>
            </ul>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex gap-4 mb-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg px-2 py-2.5 bg-[#1E4F8A] text-[14px] font-semi transition hover:bg-[#2468B5] active:scale-95"
          >
            zu Meine Fahrzeuge
          </button>

          <button
            onClick={onClose}
            className="flex-1 rounded-lg px-2 py-2.5 bg-[#1E4F8A] text-[14px] font-semi transition hover:bg-[#2468B5] active:scale-95"
          >
            Zurück zum Shop
          </button>
        </div>
      </div>
    </div>
  );
}
