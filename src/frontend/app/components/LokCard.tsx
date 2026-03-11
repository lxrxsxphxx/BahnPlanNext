import { useCallback, useState } from 'react';

import { LeasingModelDropdown } from './LeasingModelDropdown';
import LokLeasedModal from './LokLeasedModal';
import type { TransformedLok } from './ShowLoks';
import { Modal } from './modal/modal';
import type { Modell } from '@/routes/beschaffung.loks';
import { leaseLok } from '@/services/lokshop';

export interface LokCardProps {
  lok: TransformedLok;
  lokInInventory: boolean;
}

/**
 * **LokCard**
 *
 * Eine zentrale UI-Komponente zur Darstellung einer Lokomotive im Beschaffungssystem.
 * Sie ermöglicht es Nutzern, Details einzusehen, Leasingmodelle zu wählen und den Leasingprozess zu starten.
 *
 * ### Funktionalitäten
 * - **Visualisierung**: Zeigt Lok-Bild, Name und eine tabellarische Ansicht technischer Daten.
 * - **Interaktives Leasing**: Integriert das {@link LeasingModelDropdown} zur Auswahl von Konditionen.
 * - **Prozess-Steuerung**: Führt den `leaseLok` API-Call aus und validiert die Benutzereingabe.
 * - **Erfolgsbestätigung**: Öffnet ein Feedback-Modal ({@link LokLeasedModal}) nach erfolgreichem Leasing.
 *
 * ### Logik & State
 * - `selectedModel`: Speichert das vom Nutzer gewählte {@link Modell}.
 * - `isLeasedModalOpen`: Steuert das Erfolgs-Overlay nach Abschluss der Transaktion.
 * - `deliveryDate`: Berechnet das Lieferdatum (aktuelles Datum) für die Anzeige im Erfolgs-Modal.
 *
 * ### Workflow `handleLeasing`
 * 1. Prüft, ob ein Modell ausgewählt wurde.
 * 2. Ruft den asynchronen Service `leaseLok` auf.
 * 3. Setzt das lokale Lieferdatum.
 * 4. Öffnet das Bestätigungs-Modal bei Erfolg oder zeigt einen `alert` bei Fehlern.
 *
 * @param props - Die Komponenteneigenschaften.
 * @category Components
 * @example
 * ```tsx
 * <LokCard lok={lokData} />
 * ```
 */
export default function LokCard({ lok, lokInInventory = false }: LokCardProps) {
  const [selectedModel, setSelectedModel] = useState<Modell | null>(null);
  const [isLeasedModalOpen, setIsLeasedModalOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');

  const handleLeasing = useCallback(async () => {
    try {
      if (selectedModel) {
        console.debug('Leasingmodell ausgewählt:', selectedModel);
        console.debug('Lok ID für Leasing:', lok.id);
        await leaseLok(lok.id, selectedModel.id);
        setDeliveryDate(new Date().toLocaleDateString('de-DE'));
        setIsLeasedModalOpen(true);
      } else {
        alert('Bitte wählen Sie ein Leasingmodell aus.');
      }
    } catch (error) {
      alert('Fehler beim Leasing: ' + (error as Error).message);
    }
  }, [selectedModel, lok.id]);

  return (
    <>
      <div
        key={lok.name}
        className="rounded-2xl border border-blue-500/50 bg-gray-800 p-6"
      >
        <h2 className="mb-4 text-xl font-semibold">{lok.name}</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Bild */}
          <div>
            <div className="overflow-hidden rounded-md">
              <img
                src={lok.image}
                alt={lok.name}
                className="h-auto w-[20vw] object-cover"
              />
            </div>
          </div>

          {/* Spezifikationstabelle und Dropdown */}
          <div className="flex gap-4 md:col-span-2">
            <div className="rounded-md border border-gray-700 p-4">
              <table className="inline-table w-auto text-sm">
                <tbody>
                  {[...lok.specs].map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-gray-700 last:border-b-0"
                    >
                      <td className="w-48 py-1 pr-5 align-top text-gray-300">
                        {row.label}:
                      </td>
                      <td className="py-1 whitespace-pre-line text-gray-100">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="w-64 p-4">
              {lok.action.type === 'leasing' && !lokInInventory ? (
                <div>
                  <LeasingModelDropdown
                    modelle={lok.modelle}
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                  />
                  {selectedModel && (
                    <div className="mt-4 rounded-md border border-blue-500/50 bg-gray-900/60 p-3 text-xs text-gray-200">
                      <div className="text-sm font-semibold text-white">
                        Infos zum Leasingmodell
                      </div>
                      <div className="mt-1">
                        {selectedModel.jaehrlich} jährlich,{' '}
                        {selectedModel.wochenrate} wöchentlich
                      </div>
                      <div>Zahlung: {selectedModel.zahlung}</div>
                      <div>Kündigung: {selectedModel.kuendigung}</div>
                    </div>
                  )}
                  {selectedModel && (
                    <button
                      className="mt-20 w-56 rounded-4xl bg-blue-500 py-2 pr-10 pl-10 text-center text-sm font-medium hover:cursor-pointer hover:bg-blue-600"
                      onClick={handleLeasing}
                    >
                      Leasing
                    </button>
                  )}
                </div>
              ) : lokInInventory ? (
                <button
                  className={
                    `text-md mt-[40%] ml-[10vw] rounded-full px-6 py-3 font-semibold ` +
                    (lok.action.label === 'Einsatzbereit'
                      ? ' border border-green-500 bg-black/40 text-green-400'
                      : lok.action.label === 'In Lieferung'
                        ? ' border border-red-500 bg-black/40 text-red-400'
                        : ' border border-gray-500 bg-black/40 text-gray-300')
                  }
                >
                  {lok.action.label}
                </button>
              ) : (
                <button className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-600">
                  {lok.action.label}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={isLeasedModalOpen}
        onClose={() => setIsLeasedModalOpen(false)}
      >
        <LokLeasedModal
          lokName={lok.name}
          statusText="In Lieferung"
          deliveryDate={deliveryDate}
          onClose={() => setIsLeasedModalOpen(false)}
        />
      </Modal>
    </>
  );
}
