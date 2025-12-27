import type { Route } from './+types/beschaffung.loks';
import LokCard from '@/components/LokCard';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Beschaffung > Loks' },
    { name: 'description', content: 'Lok-Beschaffung: verfügbare Elektrolokomotiven mit Details' },
  ];
}
export interface Modell {
  name: string;
  Leasingdauer: string;
  Anzahlung: string;
  Monatsrate: string;
}
const loks = [
  {
    name: 'Baureihe 101 - Elektrolokomotive',
    image: '/images/loks/br101.png',
    specsLeft: [
      { label: 'Tfz geeignet für', value: 'Personen (max. 12 Wagen) / Güter (max. 2400 Tonnen)' },
      { label: 'Auslandseinsatz', value: 'D, AT' },
      { label: 'Leistung', value: '6400 kW' },
      { label: 'Höchstgeschwindigkeit', value: '220 km/h' },
      { label: 'Betriebswerke', value: 'Kategorie 2' },
      
    ],
    specsRight: [
      { label: 'Maximaltraktion', value: '2 Trz' },
      { label: 'Neupreis', value: '2.900.000 €' },
      { label: 'Kilometerkosten', value: '1,86 €/km' },
      { label: 'Energiekosten', value: '174,43 €/h' },
    ],
    action: { type: 'leasing', label: 'Leasingmodell' },
    modelle:[
      { name: 'Modell 1', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '5.000 €' },
      { name: 'Modell 2', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '10.000 €' },
      { name: 'Modell 3', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '12.000 €' },
    ]
  },
  {
    name: 'Baureihe 110 - Elektrolokomotive',
    image: '/images/loks/br110.png',
    specsLeft: [
      { label: 'Tfz geeignet für', value: 'Personen (max. 12 Wagen) / Güter (max. 2400 Tonnen)' },
      { label: 'Auslandseinsatz', value: 'D, AT' },
      { label: 'Leistung', value: '6400 kW' },
      { label: 'Höchstgeschwindigkeit', value: '220 km/h' },
      { label: 'Betriebswerke', value: 'Kategorie 2' },
    ],
    specsRight: [
      { label: 'Maximaltraktion', value: '2 Trz' },
      { label: 'Neupreis', value: '2.900.000 €' },
      { label: 'Kilometerkosten', value: '1,86 €/km' },
      { label: 'Energiekosten', value: '174,43 €/h' },
    ],
    action: { type: 'leasing', label: 'Leasingmodell'},
    modelle:[
      { name: 'Modell 1', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '5.000 €' },
      { name: 'Modell 2', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '10.000 €' },
      { name: 'Modell 3', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '12.000 €' },
    ]
  },
];

export default function BeschaffungLoks() {
  const cashBalance = 4000000; 
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:pl-58">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Shop&gt; Loks</h1>
        <div className="rounded-md bg-gray-800 px-4 py-2 text-sm">{cashBalance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</div>
      </div>

      <div className="space-y-6">
        {loks.map((lok) => (
          <LokCard key={lok.name} lok={lok} />
        ))}
      </div>
    </div>
  );
}
