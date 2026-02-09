'use client';

import { fetchLoks } from '@/services/lokshop';
import type { Route } from './+types/beschaffung.loks';
import LokCard from '@/components/LokCard';
import { Link, useLoaderData } from 'react-router';
import { useMemo } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Beschaffung > Loks' },
    { name: 'description', content: 'Lok-Beschaffung: verfügbare Elektrolokomotiven mit Details' },
  ];
}
export async function clientLoader() {
  try {
    const loks = await fetchLoks();
    return { loks, error: null };
  } catch (err) {
    console.error('Fehler beim Laden der Loks im Loader:', err);
    return { loks: [], error: (err as Error).message || 'Fehler beim Laden der Loks' };
  }
}

export interface Modell {
  id: number;
  name: string;
  jaehrlich: string;
  wochenrate: string;
  zahlung: string;
  kuendigung: string;
}

export default function BeschaffungLoks() {
  const cashBalance = 4000000;
  const { loks, error } = useLoaderData() as { loks: any[], error: string | null };
console.log('Loks from loader:', loks);


  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0F14] text-white px-[40px] py-8 md:pl-[270px]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">
            <Link to="/beschaffung" className="hover:underline">Shop</Link> &gt; Loks
          </h1>
          <div className="rounded-md bg-gray-800 px-4 py-2 text-sm">
            {cashBalance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </div>
        </div>
        <div className="rounded-md bg-red-500/20 p-4 text-red-200">
          <p>Fehler beim Laden der Loks aus der Datenbank.</p>
          <p className="text-sm mt-2">Fehler: {error}</p>
        </div>
      </div>
    );
  }

  // Transform API data to match LokCard structure
    const transformedLoks = useMemo(() => loks.map((lok: any) => ({
    id: lok.id,
    name: `Baureihe ${lok.name} - ${lok.traction_type || 'Unbekannt'}`,
    image: `/images/loks/${lok.image_key}`,
    specs: [
      { label: 'Tfz geeignet für', value: `Personen ( max ${lok.suitable_passenger_max_wagons} Wagen) \n Güter (max ${lok.suitable_freight_max_tons} Tonnen)` },
      { label: 'Auslandseinsatz', value: lok.countries_allowed || 'Keine Einschränkung' },
      { label: 'Leistung', value: lok.power_kw ? `${lok.power_kw} kW` : 'Unbekannt' },
      { label: 'Höchstgeschwindigkeit', value: lok.max_speed_kmh ? `${lok.max_speed_kmh} km/h` : 'Unbekannt' },
      { label: 'Betriebswerke', value: `Kategorie ${lok.depot_category}` || 'Unbekannt' },
      { label: 'Maximaltraktion', value: `${lok.max_traction_units} Tfz` || 'Unbekannt' },
      { label: 'Verfügbar', value: `${lok.available_stock} / ${lok.total_stock}` },
      
      { label: 'Neupreis', value: `${Number(lok.new_price).toLocaleString('de-DE')} €` },
      { label: 'Kilometerkosten', value: `${lok.km_cost.toFixed(2)} €/km` },
      { label: 'Energiekosten', value: `${lok.energy_cost_base.toFixed(2)} €/h` },
    ],
    action: { type: 'leasing', label: 'Leasingmodell' },
    modelle: [
      {
        id: 1,
        name: 'Modell 1',
        jaehrlich: '0 %',
        wochenrate: '0,30 %',
        zahlung: 'jährlich im Voraus',
        kuendigung: 'nach 6 Wochen, 25.000 € (entfällt nach 365 Tagen)',
      },
      {
        id: 2,
        name: 'Modell 2',
        jaehrlich: '5 %',
        wochenrate: '0,18 %',
        zahlung: 'jährlich im Voraus',
        kuendigung: 'nach 6 Wochen, 25.000 € (entfällt nach 365 Tagen)',
      },
      {
        id: 3,
        name: 'Modell 3',
        jaehrlich: '10 %',
        wochenrate: '0,06 %',
        zahlung: 'jährlich im Voraus',
        kuendigung: 'nach 6 Wochen, 25.000 € (entfällt nach 365 Tagen)',
      },
      {
        id: 4,
        name: 'Modell 4',
        jaehrlich: '0 %',
        wochenrate: '0,33 %',
        zahlung: 'jährlich im Voraus',
        kuendigung: 'jederzeit, keine Sperrfrist/keine Kündigungsgebühr',
      },
    ],
  })), [loks]);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white py-8 px-10 ">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">
          <Link to="/beschaffung" className="hover:underline">Shop</Link> &gt; Loks
        </h1>
        <div className="rounded-md bg-gray-800 px-4 py-2 text-sm">
          {cashBalance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
        </div>
      </div>

      <div className="space-y-6">
        {transformedLoks.map((lok: any) => (
          <LokCard key={lok.name} lok={lok}  lokInInventory={false} />
        ))}
      </div>
    </div>
  );
}
