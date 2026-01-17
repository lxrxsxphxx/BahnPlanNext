import type { Route } from './+types/beschaffung.wagen';
import WagenLeasenForm from '../components/wagen_leasen/wagen-leasen-form';
import LeasingSuccessModal from '../components/wagen_leasen/wagen-leasen-success-modal';
import { useState } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Beschaffung > Wagen' },
    { name: 'description', content: 'Wagen-Beschaffung: verfügbare Wagen mit Details' },
  ];
}

export default function BeschaffungWagen() {
  const cashBalance = 4000000;
  const wagenName = 'Silberlinge';

  const [leasingOpen, setLeasingOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [leasedStandard, setLeasedStandard] = useState(0);
  const [leasedSteuer, setLeasedSteuer] = useState(0);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white px-[40px] py-8 md:pl-[270px]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Shop&gt; Wagen</h1>
        <div className="rounded-md bg-gray-800 px-4 py-2 text-sm">
          💰 {cashBalance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
        </div>
      </div>

      <button
        className="rounded bg-green-600 px-4 py-2 font-semibold hover:bg-green-700"
        onClick={() => setLeasingOpen(true)}
      >
        Wagen leasen
      </button>

      {/* Form Leasing */}
      {leasingOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <WagenLeasenForm
            wagenName={wagenName}
            onClose={() => setLeasingOpen(false)}
            onLeasenSuccess={(standard, steuer) => {
              setLeasedStandard(standard);
              setLeasedSteuer(steuer);
              setLeasingOpen(false);
              setSuccessModalOpen(true);
            }}
          />
        </div>
      )}

      {successModalOpen && (
        <LeasingSuccessModal
          wagenName={wagenName}
          standardWagen={leasedStandard}
          steuerWagen={leasedSteuer}
          onClose={() => setSuccessModalOpen(false)}
        />
      )}
    </div>
  );
}
