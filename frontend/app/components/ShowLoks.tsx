import { useMemo } from 'react';

import LokCard from '@/components/LokCard';

type Props = {
  loks: any[];
  error: string | null;
};

export default function ShowLoks({ loks, error }: Props) {
  const transformedLoks = useMemo(() => {
    const items = loks || [];
    const counts: Record<string, number> = {};
    items.forEach((l: any) => {
      const key = l.type_name || 'Unbekannt';
      counts[key] = (counts[key] || 0) + 1;
    });

    const seen: Record<string, number> = {};
    return items.map((lok: any) => {
      const key = lok.type_name || 'Unbekannt';
      seen[key] = (seen[key] || 0) + 1;
      const suffix = counts[key] > 1 ? ` (${seen[key]})` : '';
      const traction = lok.traction_type || 'Unbekannt';

      return {
        id: lok.id,
        name: `Baureihe ${key} - ${traction}${suffix}`,
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
            value: `Kategorie ${lok.depot_category}` || 'Unbekannt',
          },
          {
            label: 'Maximaltraktion',
            value: `${lok.max_traction_units} Tfz` || 'Unbekannt',
          },
          {
            label: 'Neupreis',
            value: `${Number(lok.new_price).toLocaleString('de-DE')} €`,
          },
          { label: 'Kilometerkosten', value: `${lok.km_cost.toFixed(2)} €/km` },
          {
            label: 'Energiekosten',
            value: `${lok.energy_cost_base.toFixed(2)} €/h`,
          },
        ],
        action: {
          type: 'kauf',
          label: lok.is_leased ? 'Einsatzbereit' : 'In Lieferung',
        },
        modelle: [],
      };
    });
  }, [loks]);

  // keep the debug log that was previously in the route file
  // eslint-disable-next-line no-console
  console.log('Transformed Loks (ShowLoks):', transformedLoks);

  return (
    <div className="space-y-6">
      {transformedLoks.length === 0 && !error && (
        <div className="rounded-md bg-yellow-500/20 p-4 text-yellow-200">
          <p>
            Keine Loks gefunden. Es sieht so aus, als ob du noch keine Loks
            besitzt. Besuche den Shop, um neue Loks zu kaufen!
          </p>
        </div>
      )}
      {transformedLoks.map((lok: any) => (
        <LokCard key={lok.id} lok={lok} lokInInventory={true} />
      ))}
    </div>
  );
}
