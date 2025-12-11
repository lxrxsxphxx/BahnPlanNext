import type { Route } from './+types/beschaffung.loks';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Beschaffung > Loks' },
    { name: 'description', content: 'Lok-Beschaffung: verfügbare Elektrolokomotiven mit Details' },
  ];
}

const loks = [
  {
    name: 'Baureihe 101 - Elektrolokomotive',
    image: '/images/loks/br101.jpg',
    specsLeft: [
      { label: 'Auslandseinsatz', value: 'D, AT' },
      { label: 'Leistung', value: '6400 kW' },
      { label: 'Höchstgeschwindigkeit', value: '220 km/h' },
      { label: 'Betriebswerke', value: 'Kategorie 2' },
      { label: 'Maximaltraktion', value: '2 Trz' },
    ],
    specsRight: [
      { label: 'Tfz geeignet für', value: 'Personen (max. 12 Wagen) / Güter (max. 2400 Tonnen)' },
      { label: 'Neupreis', value: '2.900.000 €' },
      { label: 'Kilometerkosten', value: '1,86 €/km' },
      { label: 'Energiekosten', value: '174,43 €/h' },
    ],
    action: { type: 'leasing', label: 'Leasingmodell', note: 'Zahlung 1× jährlich' },
  },
  {
    name: 'Baureihe 110 - Elektrolokomotive',
    image: '/images/loks/br110.jpg',
    specsLeft: [
      { label: 'Auslandseinsatz', value: 'D, AT' },
      { label: 'Leistung', value: '6400 kW' },
      { label: 'Höchstgeschwindigkeit', value: '220 km/h' },
      { label: 'Betriebswerke', value: 'Kategorie 2' },
      { label: 'Maximaltraktion', value: '2 Trz' },
    ],
    specsRight: [
      { label: 'Tfz geeignet für', value: 'Personen (max. 12 Wagen) / Güter (max. 2400 Tonnen)' },
      { label: 'Neupreis', value: '2.900.000 €' },
      { label: 'Kilometerkosten', value: '1,86 €/km' },
      { label: 'Energiekosten', value: '174,43 €/h' },
    ],
    action: { type: 'buy', label: 'Kaufen>' },
  },
];

export default function BeschaffungLoks() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:pl-58">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Shop&gt; Loks</h1>
        <div className="rounded-md bg-gray-800 px-4 py-2 text-sm">4.000.000 €</div>
      </div>

      <div className="space-y-6">
        {loks.map((lok) => (
          <div key={lok.name} className="rounded-2xl border border-blue-500/50 bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">{lok.name}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Image */}
              <div>
                <div className="overflow-hidden rounded-md border border-gray-700">
                  {/* Placeholder image paths; replace with real assets in /public/images */}
                  <img src={lok.image} alt={lok.name} className="h-48 w-full object-cover" />
                </div>
              </div>

              {/* Specs single table + action */}
              <div className="flex flex-col gap-4 md:col-span-2 max-w-[40vw]">
                <div className="rounded-md border border-gray-700 p-4">
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

                <div className="rounded-md border border-gray-700 p-4">
                  {lok.action.type === 'leasing' ? (
                    <div>
                      <div className="mb-2 font-medium">{lok.action.label}</div>
                      <div className="text-sm text-gray-300">Info zum Leasingmodell:</div>
                      <ul className="list-disc pl-5 text-sm text-gray-300">
                        <li>{lok.action.note}</li>
                      </ul>
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
