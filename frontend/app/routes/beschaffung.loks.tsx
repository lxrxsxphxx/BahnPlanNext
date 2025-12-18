import type { Route } from './+types/beschaffung.loks';
import { LeasingModelDropdown } from '../components/LeasingModelDropdown';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Beschaffung > Loks' },
    { name: 'description', content: 'Lok-Beschaffung: verfügbare Elektrolokomotiven mit Details' },
  ];
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
          <div key={lok.name} className="rounded-2xl border border-blue-500/50 bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">{lok.name}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Bild */}
              <div>
                <div className="overflow-hidden rounded-md border border-gray-700">
                  <img src={lok.image} alt={lok.name} className="h-103 w-full object-cover" />
                </div>
              </div>

              {/* Spezifikationstabelle und Dropdown */}
              <div className="md:col-span-2 flex gap-4">
                <div className="max-w-full rounded-md border border-gray-700 p-4">
                  <table className="w-full text-sm">
                    <tbody>
                      {[...lok.specsLeft, ...lok.specsRight].map((row) => (
                        <div>
                            <tr key={row.label}>
                            <td className="py-1 text-gray-300 pr-5">{row.label}:</td>
                            <td className="py-1 text-gray-100">{row.value}</td>
                            </tr>
                            <hr />
                        </div>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="w-64  p-4">
                  {lok.action.type === 'leasing' ? (
                    <div>
                      <LeasingModelDropdown modelle={lok.modelle} />
                      <button className='mt-20 w-56 text-center bg-blue-500 rounded-4xl pl-10 pr-10 py-2 text-sm font-medium hover:bg-blue-600 hover:cursor-pointer'>
                        Leasing
                        </button>
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
        ))}
      </div>
    </div>
  );
}
