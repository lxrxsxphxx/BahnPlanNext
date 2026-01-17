'use client';

import { fetchLoks } from '@/services/lokshop';
import type { Route } from './+types/beschaffung.loks';
import LokCard from '@/components/LokCard';
import { useEffect, useState } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Beschaffung > Loks' },
    { name: 'description', content: 'Lok-Beschaffung: verfügbare Elektrolokomotiven mit Details' },
  ];
}

export interface Modell {
  id: number;
  name: string;
  Leasingdauer: string;
  Anzahlung: string;
  Monatsrate: string;
}

export default function BeschaffungLoks() {
  const cashBalance = 4000000;
  const [loks, setLoks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLoks = async () => {
      try {
        const data = await fetchLoks();
        console.log('Fetched loks:', data);
        setLoks(data);
      } catch (err) {
        console.error('Error fetching loks:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    loadLoks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] text-white px-[40px] py-8 md:pl-[270px]">
        <p>Loading locomotives...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0F14] text-white px-[40px] py-8 md:pl-[270px]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Shop&gt; Loks</h1>
          <div className="rounded-md bg-gray-800 px-4 py-2 text-sm">
            {cashBalance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </div>
        </div>
        <div className="rounded-md bg-red-500/20 p-4 text-red-200">
          <p>Error loading loks from database. Please log in first using the Dev Login button.</p>
          <p className="text-sm mt-2">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Transform API data to match LokCard structure
  const transformedLoks = loks.map((lok: any) => ({
      id: lok.id,
      name: lok.name,
      image: `/images/loks/${lok.image_key}`,
      specsLeft: [
        { label: 'Fahrzeugtyp', value: lok.kind },
        { label: 'Verfügbar', value: `${lok.available_stock} / ${lok.total_stock}` },
      ],
      specsRight: [
        { label: 'Neupreis', value: `${(lok.new_price / 1000000).toFixed(2)}M €` },
        { label: 'Kilometerkosten', value: `${lok.km_cost.toFixed(2)} €/km` },
        { label: 'Energiekosten', value: `${lok.energy_cost_base.toFixed(2)} €/h` },
      ],
      action: { type: 'leasing', label: 'Leasingmodell' },
      modelle: [
        { id: 1, name: 'Modell 1', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '5.000 €' },
        { id: 2, name: 'Modell 2', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '10.000 €' },
        { id: 3, name: 'Modell 3', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '12.000 €' },
      ],
    }));

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white px-[40px] py-8 md:pl-[270px]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Shop&gt; Loks</h1>
        <div className="rounded-md bg-gray-800 px-4 py-2 text-sm">
          {cashBalance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
        </div>
      </div>

      <div className="space-y-6">
        {transformedLoks.map((lok: any) => (
          <LokCard key={lok.name} lok={lok} />
        ))}
      </div>
    </div>
  );
}
