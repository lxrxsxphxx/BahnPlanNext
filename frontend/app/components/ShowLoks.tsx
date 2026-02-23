import { useMemo } from 'react';

import LokCard from '@/components/LokCard';
import type { Modell } from '@/routes/beschaffung.loks';
import type { CompanyLok } from '@/services/gesellschaftsbereich';

export interface TransformedLok {
  id: number;
  name: string;
  image: string;
  specs: { label: string; value: string }[];
  action: { type: 'leasing' | 'kauf'; label: string };
  modelle: Modell[];
}

export type Props = {
  loks?: CompanyLok[];
  error?: string;
};

export default function ShowLoks({ loks, error }: Props) {
  const transformedLoks = useMemo(() => {
    const items = loks || [];
    const counts: Record<string, number> = {};
    items.forEach((l) => {
      const key = l.type_name || 'Unbekannt';
      counts[key] = (counts[key] || 0) + 1;
    });

    const seen: Record<string, number> = {};
    return items.map((lok) => {
      const key = lok.type_name || 'Unbekannt';
      seen[key] = (seen[key] || 0) + 1;
      const suffix = counts[key] > 1 ? ` (${seen[key]})` : '';
      const traction = lok.traction_type || 'Unbekannt';

      const deliveryStatus = (lok as any).delivery_status as string | undefined;
      const deliveryEnd = (lok as any).delivery_end_at_date as Date | null | undefined;
      const deliveredAt = (lok as any).delivered_at_date as Date | null | undefined;

      const deliverySpecLabel = (() => {
        if (deliveryStatus === 'in_delivery') {
          const eta = deliveryEnd ? ` (vorauss. ${deliveryEnd.toLocaleDateString('de-DE')})` : '';
          return `In Lieferung${eta}`;
        }
        if (deliveredAt) {
          return `Eingetroffen am ${deliveredAt.toLocaleDateString('de-DE')}`;
        }
        return lok.is_leased ? 'Einsatzbereit' : 'Verfügbar';
      })();

      // Short action label for the button (no ETA/time)
      const actionLabel = (() => {
        if (deliveryStatus === 'in_delivery') return 'In Lieferung';
        if (deliveredAt) return 'Eingetroffen';
        return lok.is_leased ? 'Einsatzbereit' : 'Verfügbar';
      })();

      return {
        id: lok.id,
        name: `Baureihe ${key} - ${traction}${suffix}`,
        image: `/images/loks/${lok.image_key}`,
        specs: [
          {
            label: 'Tfz geeignet für',
            value: `Personen ( max ${lok.suitable_passenger_max_wagons ?? '–'} Wagen) \n Güter (max ${lok.suitable_freight_max_tons ?? '–'} Tonnen)`,
          },
          {
            label: 'Auslandseinsatz',
            value: lok.countries_allowed || 'Keine Einschränkung',
          },
          {
            label: 'Leistung',
            value:
              lok.power_kw === undefined ? 'Unbekannt' : `${lok.power_kw} kW`,
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
              ? `${lok.max_traction_units} Tfz`
              : 'Unbekannt',
          },
          {
            label: 'Neupreis',
            value:
              lok.new_price === undefined
                ? 'Unbekannt'
                : `${Number(lok.new_price).toLocaleString('de-DE')} €`,
          },
          {
            label: 'Kilometerkosten',
            value:
              lok.km_cost === undefined
                ? 'Unbekannt'
                : `${lok.km_cost.toFixed(2)} €/km`,
          },
          {
            label: 'Energiekosten',
            value:
              lok.energy_cost_base === undefined
                ? 'Unbekannt'
                : `${lok.energy_cost_base.toFixed(2)} €/h`,
          },
          {
            label: 'Lieferstatus',
            value: deliverySpecLabel,
          },
        ],
        action: {
          type: 'kauf',
          label: actionLabel,
        },
        modelle: [],
      } as TransformedLok;
    });
  }, [loks]);

  // keep the debug log that was previously in the route file
  // eslint-disable-next-line no-console
  console.debug('Transformed Loks (ShowLoks):', transformedLoks);

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
      {transformedLoks.map((lok) => (
        <LokCard key={lok.id} lok={lok} lokInInventory={true} />
      ))}
    </div>
  );
}
