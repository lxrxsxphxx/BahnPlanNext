import { useMemo } from 'react';
import { Link, useLoaderData } from 'react-router';

import type { Route } from './+types/beschaffung.loks';
import LokCard from '@/components/LokCard';
import type { TransformedLok } from '@/components/ShowLoks';
import { fetchCompanyInfo } from '@/services/gesellschaftsbereich';
import { fetchLoks } from '@/services/lokshop';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Beschaffung > Loks' },
    {
      name: 'description',
      content: 'Lok-Beschaffung: verfügbare Elektrolokomotiven mit Details',
    },
  ];
}

export async function clientLoader() {
  try {
    const loks = await fetchLoks();
    const company = await fetchCompanyInfo();
    return { loks, company };
  } catch (err) {
    console.error('Fehler beim Laden der Loks im Loader:', err);
    return {
      error: (err as Error).message || 'Fehler beim Laden der Loks',
    };
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
  const { loks, company, error } = useLoaderData<typeof clientLoader>();
  console.debug('Loks from loader:', loks);
  const cashBalance = company?.capital ?? 4000000;

  // Transform API data to match LokCard structure
  const transformedLoks = useMemo<TransformedLok[]>(() => {
    if (!loks) return [];
    return loks.map(
      (lok): TransformedLok => ({
        id: lok.id,
        name: `Baureihe ${lok.name || 'Unbekannt'} - ${lok.traction_type || 'Unbekannt'}`,
        image: `/images/loks/${lok.image_key}`,
        specs: [
          {
            label: 'Tfz geeignet für',
            value: `Personen ( max ${lok.suitable_passenger_max_wagons} Wagen) \n Güter (max ${lok.suitable_freight_max_tons} Tonnen)`,
          },
          {
            label: 'Auslandseinsatz',
            value: lok.countries_allowed || 'Keine Einschränkung',
          },
          {
            label: 'Leistung',
            value: lok.power_kw ? `${lok.power_kw} kW` : 'Unbekannt',
          },
          {
            label: 'Höchstgeschwindigkeit',
            value: lok.max_speed_kmh
              ? `${lok.max_speed_kmh} km/h`
              : 'Unbekannt',
          },
          {
            label: 'Betriebswerke',
            value: lok.depot_category
              ? `Kategorie ${lok.depot_category}`
              : 'Unbekannt',
          },
          {
            label: 'Maximaltraktion',
            value: lok.max_traction_units
              ? `${Number(lok.max_traction_units)} Tfz`
              : 'Unbekannt',
          },
          {
            label: 'Verfügbar',
            value: `${lok.available_stock} / ${lok.total_stock}`,
          },

          {
            label: 'Neupreis',
            value: lok.new_price
              ? `${Number(lok.new_price).toLocaleString('de-DE')} €`
              : 'Unbekannt',
          },
          {
            label: 'Kilometerkosten',
            value: lok.km_cost
              ? `${Number(lok.km_cost).toFixed(2)} €/km`
              : 'Unbekannt',
          },
          {
            label: 'Energiekosten',
            value: lok.energy_cost_base
              ? `${Number(lok.energy_cost_base).toFixed(2)} €/h`
              : 'Unbekannt',
          },
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
      }),
    );
  }, [loks]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0F14] px-[40px] py-8 text-white">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            <Link to="/beschaffung" className="hover:underline">
              Shop
            </Link>{' '}
            &gt; Loks
          </h1>
          <div className="rounded-md bg-gray-800 px-4 py-2 text-sm">
            {cashBalance.toLocaleString('de-DE', {
              style: 'currency',
              currency: 'EUR',
            })}
          </div>
        </div>
        <div className="rounded-md bg-red-500/20 p-4 text-red-200">
          <p>Fehler beim Laden der Loks aus der Datenbank.</p>
          <p className="mt-2 text-sm">Fehler: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white py-8 px-10 ">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">
          <Link to="/beschaffung" className="hover:underline">
            Shop
          </Link>{' '}
          &gt; Loks
        </h1>
        <div className="rounded-md bg-gray-800 px-4 py-2 text-sm">
          {cashBalance.toLocaleString('de-DE', {
            style: 'currency',
            currency: 'EUR',
          })}
        </div>
      </div>

      <div className="space-y-6">
        {transformedLoks.map((lok: TransformedLok) => (
          <LokCard key={lok.id} lok={lok} lokInInventory={false} />
        ))}
      </div>
    </div>
  );
}
