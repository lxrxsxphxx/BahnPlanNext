import { useNavigate } from "react-router";
interface LokLeasedModalProps {
  lokName: string;
  statusText: string;
  deliveryDate: string;
  onClose: () => void;
  onViewVehicles?: () => void;
}

export default function LokLeasedModal({
  lokName,
  statusText,
  deliveryDate,
  onClose,
  onViewVehicles,
}: LokLeasedModalProps) {
  const navigate = useNavigate();
  const handleGoToFahrzeuge = () => {
    navigate('/gesellschaftsbereich/fahrzeuge');
  };
  return (
    <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 text-white shadow-xl animate-scaleIn">
      <div className="mb-4 flex items-center justify-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-400 text-green-300">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      </div>
      <h2 className="mb-2 text-center text-2xl font-semibold italic">Lok geleast!</h2>
      <p className="mb-6 text-center text-sm text-gray-200">Vielen Dank. Ihre Lok ist nun in Ihrem Depot verfügbar.</p>

      <div className="rounded-lg border border-gray-700 bg-gray-900/40 p-4 text-sm">
        <div className="mb-3 text-xs uppercase tracking-wide text-gray-400">Lok-Informationen</div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Baureihe</span>
            <span className="text-white">{lokName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Status</span>
            <span className="text-emerald-300">{statusText}</span>
          </div>
        </div>

        <div className="my-4 h-px bg-gray-700" />

        <div className="mb-2 text-xs uppercase tracking-wide text-gray-400">Lieferinformationen</div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Lieferdatum</span>
            <span className="text-white">{deliveryDate}</span>
          </div>
          <div className="text-xs text-gray-400">Leasingkosten werden ab Lieferdatum abgezogen.</div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          className="rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-xs font-medium text-gray-200 hover:bg-gray-700"
          onClick={handleGoToFahrzeuge}
        >
          Zu Meine Fahrzeuge
        </button>
        <button
          type="button"
          className="rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500"
          onClick={onClose}
        >
          Zurück zum Shop
        </button>
      </div>
    </div>
  );
}