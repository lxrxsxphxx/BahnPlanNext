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

/**
 * **ShowLoks**
 * * Diese Komponente dient als zentrale Anzeige-Logik für den Lokomotiv eines Spielers. 
 * Sie fungiert als "Adapter", der rohe API-Daten (`CompanyLok`) in ein benutzerfreundliches 
 * Anzeige-Format (`TransformedLok`) für die `LokCard` umwandelt.
 *
 * ### Hauptfunktionen
 * - **Daten-Veredelung**: Berechnet formatierte Strings für Währungen (€), Geschwindigkeiten (km/h) und Leistungen (kW).
 * - **Auto-Indexierung**: Erkennt Duplikate desselben Typs und fügt automatisch eine Nummerierung hinzu (z.B. "Baureihe 101 (1)", "Baureihe 101 (2)").
 * - **Einsatz-Checks**: Bereitet komplexe Texte für die maximale Wagenanzahl und Tonnage-Kapazität auf.
 * - **Leerzustand-Handling**: Informiert den Nutzer proaktiv, wenn noch keine Fahrzeuge vorhanden sind.
 *
 * ### Logik & Performance
 * - **Zwei-Phasen-Algorithmus**:
 * 1. *Phase 1*: Zählt alle Vorkommen eines Typs in `counts`.
 * 2. *Phase 2*: Transformiert jedes Element und nutzt den `seen`-Counter für die korrekte Suffix-Vergabe.
 * - **Performance-Optimierung**: Dank `useMemo` wird die komplexe Schleifen-Logik nur dann ausgeführt, wenn sich das `loks`-Array tatsächlich ändert (z.B. nach einem Kauf).
 * - **Fehlertoleranz**: Behandelt `undefined` Werte und liefert standardmäßig "Unbekannt", um UI-Abstürze zu verhindern.
 *
 * @param props - Die Properties der Komponente.
 * @param props.loks - Die Liste der Lokomotiven vom Server (optional).
 * @param props.error - Eine Fehlermeldung, falls der Datenabruf fehlgeschlagen ist.
 * * @category Display-Components
 * @example
 * ```tsx
 * <ShowLoks 
 * loks={data.myInventory} 
 * error={apiError} 
 * />
 * ```
 */

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
        ],
        action: {
          type: 'kauf',
          label: lok.is_leased ? 'Einsatzbereit' : 'In Lieferung',
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
