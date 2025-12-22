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
    modelle: [
      { name: 'Modell 1', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '5.000 €' },
      { name: 'Modell 2', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '10.000 €' },
      { name: 'Modell 3', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '12.000 €' },
    ],
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
    action: { type: 'leasing', label: 'Leasingmodell' },
    modelle: [
      { name: 'Modell 1', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '5.000 €' },
      { name: 'Modell 2', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '10.000 €' },
      { name: 'Modell 3', Leasingdauer: '1 Jahr', Anzahlung: '1/3 Gesamtwert', Monatsrate: '12.000 €' },
    ],
  },
];

export default function BeschaffungLoks() {
  const cashBalance = 4000000;

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white px-[40px] py-8 md:pl-[270px]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Shop&gt; Loks</h1>
        <div className="rounded-md bg-gray-800 px-4 py-2 text-sm">
          {cashBalance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
        </div>
      </div>

      <div className="space-y-6">
        {loks.map((lok) => (
          <div key={lok.name} className="rounded-2xl border border-[#223041] bg-[#121C27] px-10 py-6">
            <h2 className="mb-4 text-xl font-semibold">{lok.name}</h2>

            {/* Grid responsive */}
            <div className="grid grid-cols-1 md:grid-cols-[min-content_auto_auto] gap-6 items-start">
              
              {/* Bild */}
              <div>
                <div className="overflow-hidden rounded-md border border-gray-700 h-80 w-110">
                  <img src={lok.image} alt={lok.name} className="block h-80 w-110 object-cover" />
                </div>
              </div>

              {/* Spezifikationstabelle */}
              <div className="max-w-full bg-[#101822] rounded-md border border-gray-700 p-4">
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    {[...lok.specsLeft, ...lok.specsRight].map((row, index, arr) => (
                      <tr
                        key={row.label}
                        className={index < arr.length - 1 ? "border-b border-[#314358]" : ""}
                      >
                        <td className="py-1 text-gray-300 pr-5">{row.label}:</td>
                        <td className="py-1 text-gray-100">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Dropdown + button */}
              <div className="flex flex-col items-center md:items-start w-full md:w-64 p-4">
                {lok.action.type === 'leasing' ? (
                  <div>
                    <LeasingModelDropdown modelle={lok.modelle} />
                    <button className="mt-4 w-full md:w-56 text-center bg-[#346092] rounded-4xl py-2 text-sm font-medium hover:bg-[#3673B8] hover:cursor-pointer">
                      Leasing
                    </button>
                  </div>
                ) : (
                  <button className="w-full md:w-auto rounded-md bg-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-600">
                    {lok.action.label}
                  </button>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
