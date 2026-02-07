import type { Modell } from "@/routes/beschaffung.loks";
import { LeasingModelDropdown } from "./LeasingModelDropdown";
import { useState } from "react";
import { leaseLok } from "@/services/lokshop";
import LokLeasedModal from "./LokLeasedModal";
import { Modal } from "./modal/modal";
interface Lok{
    id: number;
    name: string;
    image: string;
    specs: { label: string; value: string }[];
    action: { type: 'leasing' | 'kauf'; label: string };
    modelle: Modell[];
}

interface LokCardProps {
  lok: Lok;
  lokInInventory: boolean;
}

export default function LokCard({ lok, lokInInventory = false }: LokCardProps) {
    const [selectedModel, setSelectedModel] = useState<Modell | null>(null);
  const [isLeasedModalOpen, setIsLeasedModalOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
    
    const handleLeasing = async () => {
      try {
        if (selectedModel) {
          await leaseLok(lok.id, selectedModel.id);
          setDeliveryDate(new Date().toLocaleDateString('de-DE'));
          setIsLeasedModalOpen(true);
        } else {
          alert('Bitte wählen Sie ein Leasingmodell aus.');
        }
      } catch (error) {
        alert('Fehler beim Leasing: ' + (error as Error).message);
      }
    }
  return (
    <>
    <div key={lok.name} className="rounded-2xl border border-blue-500/50 bg-gray-800 p-6">
                <h2 className="mb-4 text-xl font-semibold">{lok.name}</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Bild */}
                  <div>
                    <div className="overflow-hidden rounded-md ">
                      <img src={lok.image} alt={lok.name} className="w-[20vw] h-auto object-cover" />
                    </div>
                  </div>
    
                  {/* Spezifikationstabelle und Dropdown */}
                  <div className="md:col-span-2 flex gap-4">
                    <div className="rounded-md border border-gray-700 p-4">
                      <table className="inline-table w-auto text-sm">
                        <tbody>
                          {[...lok.specs].map((row) => (
                            <tr key={row.label} className="border-b border-gray-700 last:border-b-0">
                              <td className="w-48 py-1 pr-5 text-gray-300 align-top">{row.label}:</td>
                              <td className="py-1 text-gray-100 whitespace-pre-line">{row.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="w-64  p-4">
                      {lok.action.type === 'leasing' && !lokInInventory ? (
                        <div>
                          <LeasingModelDropdown 
                            modelle={lok.modelle} 
                            selectedModel={selectedModel} 
                            setSelectedModel={setSelectedModel} 
                          />
                          {selectedModel && (
                            <div className="mt-4 rounded-md border border-blue-500/50 bg-gray-900/60 p-3 text-xs text-gray-200">
                              <div className="text-sm font-semibold text-white">Infos zum Leasingmodell</div>
                              <div className="mt-1">
                                {selectedModel.jaehrlich} jährlich, {selectedModel.wochenrate} wöchentlich
                              </div>
                              <div>Zahlung: {selectedModel.zahlung}</div>
                              <div>Kündigung: {selectedModel.kuendigung}</div>
                            </div>
                          )}
                          {selectedModel && <button className='mt-20 w-56 text-center bg-blue-500 rounded-4xl pl-10 pr-10 py-2 text-sm font-medium hover:bg-blue-600 hover:cursor-pointer'
                          onClick={handleLeasing}
                          >
                            Leasing
                            </button>}
                        </div>
                      ) : (
                        <button className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-600">
                          {lok.action.label}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
    <Modal open={isLeasedModalOpen} onClose={() => setIsLeasedModalOpen(false)}>
      <LokLeasedModal
        lokName={lok.name}
        statusText="In Lieferung"
        deliveryDate={deliveryDate}
        onClose={() => setIsLeasedModalOpen(false)}
      />
    </Modal>
    </>
  )
}