import LokCard from '@/components/LokCard';
import { fetchCompaniesLoks, fetchCompanyInfo } from '@/services/gesellschaftsbereich';
import { useLoaderData } from 'react-router';
import { useMemo } from 'react';


export async function clientLoader() {
  try{
    const loks = await fetchCompaniesLoks();
    const company = await fetchCompanyInfo();
    // Debug: show raw payload so missing fields can be inspected in browser console
    // Remove or guard this in production.
    // eslint-disable-next-line no-console
    console.log('clientLoader: company, loks', { company, loks });
    return { loks, company, error: null };
  }catch (err) {
    console.error('Fehler beim Laden der Loks im Loader:', err);
    return { loks: [], company: null, error: (err as Error).message || 'Fehler beim Laden der Loks' };
  }
}



export default function GesellschaftsbereichFahrzeuge() {
  const { loks, company, error } = useLoaderData() as { loks: any[], company?: { id?: number; name?: string; capital?: number } | null, error: string | null };
  const cashBalance = company?.capital ?? 4000000;
  const transformedLoks = useMemo(() => {
    return (loks || []).map((lok: any) => ({
      id: lok.id,
    name: `Baureihe ${lok.type_name} - ${lok.traction_type || 'Unbekannt'}`,
    image: `/images/loks/${lok.image_key}`,
    specs: [
      { label: 'Tfz geeignet für', value: `Personen ( max ${lok.suitable_passenger_max_wagons} Wagen) \n Güter (max ${lok.suitable_freight_max_tons} Tonnen)` },
      { label: 'Auslandseinsatz', value: lok.countries_allowed || 'Keine Einschränkung' },
      { label: 'Leistung', value: lok.power_kw ? `${lok.power_kw} kW` : 'Unbekannt' },
      { label: 'Höchstgeschwindigkeit', value: lok.max_speed_kmh ? `${lok.max_speed_kmh} km/h` : 'Unbekannt' },
      { label: 'Betriebswerke', value: `Kategorie ${lok.depot_category}` || 'Unbekannt' },
      { label: 'Maximaltraktion', value: `${lok.max_traction_units} Tfz` || 'Unbekannt' },
      
      { label: 'Neupreis', value: `${Number(lok.new_price).toLocaleString('de-DE')} €` },
      { label: 'Kilometerkosten', value: `${lok.km_cost.toFixed(2)} €/km` },
      { label: 'Energiekosten', value: `${lok.energy_cost_base.toFixed(2)} €/h` },
    ],
      action: { type: 'kauf', label: lok.is_leased ? 'Einsatzbereit' : 'In Lieferung' },
      modelle: [],
    }));
  }, [loks]);
  console.log('Transformed Loks:', transformedLoks);
  return (
    <div className="min-h-screen bg-[#0B0F14] text-white p-8 md:pl-[270px]">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Gesellschaftsbereich &gt; Meine Fahrzeuge</h1>
        {error && (
          <div className="mt-4 rounded-md bg-red-500/20 p-4 text-red-200">
            <p>Fehler beim Laden der Fahrzeuge aus der Datenbank. Fehler: {error}</p>
          </div>
        )}
        {company?.name && (
          <div className="flex items-center justify-between mb-4">
          <div className="text-2xl text-gray-300">{company.name}</div>
          <div className="rounded-md bg-gray-800 px-4 py-2 text-sm">
          {cashBalance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
        </div>
          </div>
        )}

        
      </div>
      <div className="space-y-6">
        {transformedLoks.length === 0 && !error && (
          <div className="rounded-md bg-yellow-500/20 p-4 text-yellow-200">
            <p>Keine Loks gefunden. Es sieht so aus, als ob du noch keine Loks besitzt. Besuche den Shop, um neue Loks zu kaufen!</p>
          </div>
        )}
        {transformedLoks.map((lok: any) => (
          <LokCard key={lok.id} lok={lok} lokInInventory={true} />
        ))}
      </div>
    </div>
  );
}