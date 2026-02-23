import { NavLink } from 'react-router';

import type { Route } from './+types/Beschaffung';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Shop - BahnPlan' },
    { name: 'description', content: 'Kaufe Loks, Wagen, Trassen und mehr' },
  ];
}

/**
 * **Beschaffung (Page)**
 *
 * Diese Komponente dient als zentraler Hub für das Einkaufssystem von BahnPlan.
 * Sie bietet eine Übersicht über alle verfügbaren Kategorien (Loks, Wagen, Trassen, Handel).
 *
 * ### Hauptkomponenten
 * - **Kategorien-Grid**: Eine Übersicht der Teilbereiche (Wagen, Loks, Trassen, Handel) mit direkter Verlinkung.
 * - **Lieferstatus-Monitor**: Ein spezieller Bereich am unteren Ende der Seite, der aktuell bestellte, aber noch nicht gelieferte Fahrzeuge auflistet.
 *
 * ### Funktionalitäten
 * - **Navigation**: Nutzt {@link NavLink} für ein reaktives Routing innerhalb des Beschaffungs-Subsystems.
 * - **Bedingte Anzeige**: Unterscheidet bei der Lieferliste zwischen Kategorien mit aktiven Bestellungen und leeren Zuständen.
 * - **Responsives Layout**: Das Grid passt sich automatisch von einspaltig (Mobile) auf dreispaltig (Desktop) an.
 *
 * ### Datenstruktur (Lokal)
 * - `categories`: Definiert die Namen und Zielpfade für die Shop-Navigation.
 * - `inDelivery`: Hält die Informationen über laufende Lieferungen (aktuell statisch implementiert).
 *
 * @category Pages
 * @returns Die gerenderte Shop-Übersichtsseite.
 */
export default function Beschaffung() {
  const categories = [
    { name: 'Wagen', path: '/beschaffung/wagen' },
    { name: 'Loks', path: '/beschaffung/loks' },
    { name: 'Trassen', path: '/trassen' },
    { name: 'Kredite', path: '/shop/kredite' },
  ];

  const inDelivery = {
    loks: [],
    wagen: [] as string[],
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] p-8 text-white">
      <h1 className="mb-8 text-4xl font-bold">Shop</h1>

      {/* Kategorien Abschnitt */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.name}
            className="rounded-lg border border-[#223041] bg-[#121C27] p-8 transition-colors hover:border-gray-600"
          >
            <h2 className="mb-6 text-2xl font-semibold">{category.name}</h2>
            <NavLink
              to={category.path}
              className={({ isActive }: { isActive: boolean }) =>
                `inline-block rounded-md px-6 py-2 text-sm font-medium transition-colors ` +
                (isActive ? 'bg-gray-600' : 'bg-gray-700 hover:bg-gray-600')
              }
            >
              Details
            </NavLink>
          </div>
        ))}
      </div>

      {/* In Lieferung Abschnitt */}
      <div className="rounded-lg border border-[#223041] bg-[#121C27] p-8">
        <h2 className="mb-6 text-2xl font-semibold text-red-500 italic">
          In Lieferung
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Loks */}
          <div>
            <h3 className="mb-4 text-xl font-semibold">Loks</h3>
            <ul className="space-y-2">
              {inDelivery.loks.map((lok) => (
                <li key={lok} className="text-gray-300 italic">
                  {lok}
                </li>
              ))}
            </ul>
          </div>

          {/* Wagen */}
          <div>
            <h3 className="mb-4 text-xl font-semibold">Wagen</h3>
            {inDelivery.wagen.length === 0 ? (
              <p className="text-gray-500 italic">Keine Wagen in Lieferung</p>
            ) : (
              <ul className="space-y-2">
                {inDelivery.wagen.map((wagen) => (
                  <li key={wagen} className="text-gray-300 italic">
                    {wagen}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
