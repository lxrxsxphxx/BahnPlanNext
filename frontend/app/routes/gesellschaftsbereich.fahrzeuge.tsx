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
    return (loks || []).map((v: any) => ({
      id: v.id,
      name: v.type_name ? `${v.type_name} ${v.vehicle_number || ''}`.trim() : (v.vehicle_number || 'Lok'),
      image: v.image_key ? `/images/loks/${v.image_key}` : `/images/loks/br${v.id}.jpg`,
      specsLeft: [
        { label: 'Tfz geeignet für', value: v.suitable_passenger_max_wagons ? `Personen (max. ${v.suitable_passenger_max_wagons} Wagen)` : (v.suitable_freight_max_tons ? `Güter (max. ${v.suitable_freight_max_tons} Tonnen)` : '—') },
        { label: 'Auslandseinsatz', value: v.countries_allowed ?? '—' },
        { label: 'Leistung', value: v.power_kw ? `${v.power_kw} kW` : '—' },
        { label: 'Höchstgeschwindigkeit', value: v.max_speed_kmh ? `${v.max_speed_kmh} km/h` : '—' },
        { label: 'Betriebswerke', value: v.depot_category ? `Kategorie ${v.depot_category}` : '—' },
        { label: 'Maximaltraktion', value: v.max_traction_units ? `${v.max_traction_units} Tfz` : '—' },
      ],
      specsRight: [
        { label: 'Neupreis', value: v.new_price ? `${(v.new_price).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}` : '—' },
        { label: 'Kilometerkosten', value: v.km_cost ? `${v.km_cost.toFixed(2)} €/km` : '—' },
        { label: 'Energiekosten', value: v.energy_cost_base ? `${v.energy_cost_base.toFixed(2)} €/h` : '—' },
        { label: 'Kuppelbar mit', value: Array.isArray(v.compatible_with) ? v.compatible_with.join(', ') : (v.compatible_with ?? '—') },
      ],
      action: { type: 'kauf', label: v.is_leased ? 'Eingesetzt' : 'Einsatzbereit' },
      modelle: [],
    }));
  }, [loks]);
  return (
    <div className="min-h-screen bg-[#0B0F14] text-white p-8 md:pl-[270px]">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Meine Fahrzeuge</h1>
        {company?.name && (
          <div className="text-sm text-gray-300">Gesellschaft: {company.name} — Kapital: {company.capital?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</div>
        )}
      </div>
      <div className="space-y-6">
        {transformedLoks.map((lok: any) => (
          <LokCard key={lok.id} lok={lok} lokInInventory={false} />
        ))}
      </div>
    </div>
  );
}