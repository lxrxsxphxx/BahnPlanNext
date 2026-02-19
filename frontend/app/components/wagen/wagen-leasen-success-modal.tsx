import { useNavigate } from "react-router";

interface LeasingSuccessModalProps {
  wagenName: string;
  lokName: string;
  standardWagen: number;
  steuerWagen: number;
  lieferDatum: string;
  onClose: () => void;
}

export default function LeasingSuccessModal({
  wagenName,
  lokName,
  standardWagen,
  steuerWagen,
  lieferDatum,
  onClose,
}: LeasingSuccessModalProps) {  
  const navigate = useNavigate(); 

  const handleGoToFahrzeuge = () => {
    navigate('/gesellschaftsbereich/fahrzeuge'); 
  };

  return (
    <div
      className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="animate-scaleIn w-full max-w-105 rounded-2xl bg-[#121C27] p-8 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
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

        <h2 className="mt-4 text-center text-3xl font-semibold text-gray-200 italic">
          Wagen geleast!
        </h2>

        <hr className="my-3 border-gray-700" />

        <div className="space-y-2 text-sm text-gray-300">
          <div>
            <p className="mb-1 ml-5 text-[17px] font-semibold text-gray-200">
              Wagen-Informationen:
            </p>
            <ul className="ml-5 list-inside list-disc text-[15px]">
              <li>
                {wagenName}: Standard (x{standardWagen}), Stwg. (x{steuerWagen})
              </li>
              <li>
                Status: <span className="font-medium text-red-400">in Lieferung</span>
              </li>
              <li>Gekuppelt mit: {lokName}</li>
            </ul>
          </div>

          <hr className="my-3 border-gray-700" />

          <div>
            <p className="mb-1 ml-5 text-[17px] font-semibold text-gray-200">
              Lieferinformationen:
            </p>
            <ul className="ml-5 list-inside list-disc text-[15px]">
              <li>Lieferdatum: {lieferDatum}</li>
              <li>Leasingkosten werden ab Lieferdatum abgezogen</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 mb-2 flex gap-4">
          <button
            onClick={onClose}
            className="font-semi flex-1 rounded-lg bg-[#1E4F8A] px-2 py-2.5 text-[14px] transition hover:bg-[#2468B5] active:scale-95"
          >
            zurück zum Shop
          </button>
          <button
            onClick={handleGoToFahrzeuge}
            className="font-semi flex-1 rounded-lg bg-[#1E4F8A] px-2 py-2.5 text-[14px] transition hover:bg-[#2468B5] active:scale-95"
          >
            zu Meine Fahrzeuge
          </button>
        </div>
      </div>
    </div>
  );
}
