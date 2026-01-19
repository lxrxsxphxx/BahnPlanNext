import LokCard from '@/components/LokCard';
const loks = [
  {
    id: 1,
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
    modelle: [
      { id: 1, name: 'Modell 1', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '5.000 €' },
      { id: 2, name: 'Modell 2', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '10.000 €' },
      { id: 3, name: 'Modell 3', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '12.000 €' },
    ],
  },
  {
    id: 2,
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
    action: { type: 'leasing', label: 'Leasingmodell' },
    modelle: [
      { id: 1, name: 'Modell 1', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '5.000 €' },
      { id: 2, name: 'Modell 2', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '10.000 €' },
      { id: 3, name: 'Modell 3', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '12.000 €' },
    ],
  },
];
export interface Modell {
  name: string;
  Leasingdauer: string;
  Anzahlung: string;
  Monatsrate: string;
}



export default function GesellschaftsbereichFahrzeuge() {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-white p-8 md:pl-[270px]">
      <h1 className="mb-8 text-4xl font-bold">Meine Fahrzeuge</h1>
      <div className="space-y-6">
        {loks.map((lok: any) => (
          <LokCard key={lok.id} lok={lok} />
        ))}
      </div>
    </div>
  );
}