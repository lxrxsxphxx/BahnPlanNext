import { useNavigate } from "react-router";

interface NoLokErrorModalProps {
  wagenName?: string;
  onClose: () => void;
}

export default function NoLokErrorModal({ wagenName, onClose }: NoLokErrorModalProps) {
  const navigate = useNavigate();

  return (
<div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">              
<div className="w-full max-w-[400px] rounded-2xl bg-[#121C27] p-5 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-800">        
        {/* Header */}
        <h2 className="text-center text-3xl font-bold italic text-gray-200 mb-6 pt-9 pb-15">
          {wagenName} leasen
        </h2>

        <div className="bg-[#1a0a0a] border border-red-900/50 rounded-lg pl-4 pr-4 mb-8 flex gap-4 pt-6 pb-6">
          <div className="text-yellow-500 shrink-0">
            ⚠️
          </div>
          <div>
            <h4 className="text-gray-100 font-bold text-sm italic">Keine kompatible Lokomotive vorhanden</h4>
            <p className="text-gray-400 text-[11px] leading-relaxed mt-1">
              Um diesen Wagen zu leasen, benötigen Sie eine freie Lokomotive, die für diese Wagenart zugelassen ist.
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-13 pb-8 pl-4 pr-4">
          <button
            onClick={onClose}
            className="flex-1 bg-[#5c332e] hover:bg-[#7a423b] text-white py-2 rounded-md font-bold italic transition"
          >
            Abbrechen
          </button>
          <button
            onClick={() => navigate('/beschaffung/loks')} 
            className="flex-1 bg-[#33633a] hover:bg-[#42824c] text-white py-2 rounded-md font-bold italic transition"
          >
            Lok kaufen
          </button>
        </div>
      </div>
    </div>
  );
}