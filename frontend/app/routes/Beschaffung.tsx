import type { Route } from './+types/Beschaffung';
import { NavLink } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Shop - BahnPlan' },
    { name: 'description', content: 'Kaufe Loks, Wagen, Trassen und mehr' },
  ];
}

export default function Beschaffung() {
  const categories = [
    { name: 'Wagen', path: '/beschaffung/wagen' },
    { name: 'Loks', path: '/beschaffung/loks' },
    { name: 'Trassen', path: '/beschaffung/trassen' },
    { name: 'Handel', path: '/beschaffung/handel' },
  ];

  const inDelivery = {
    loks: ['Baureihe 101 - Elektrolokomotive', 'Baureihe 110 - Elektrolokomotive'],
    wagen: [],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 md:pl-58">
      <h1 className="mb-8 text-4xl font-bold">Shop</h1>

      {/* Kategorien Abschnitt */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.name}
            className="rounded-lg border border-gray-700 bg-gray-800 p-8 transition-colors hover:border-gray-600"
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
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-8">
        <h2 className="mb-6 text-2xl font-semibold italic text-red-500">In Lieferung</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Loks */}
          <div>
            <h3 className="mb-4 text-xl font-semibold">Loks</h3>
            <ul className="space-y-2">
              {inDelivery.loks.map((lok, index) => (
                <li key={index} className="italic text-gray-300">
                  {lok}
                </li>
              ))}
            </ul>
          </div>

          {/* Wagen */}
          <div>
            <h3 className="mb-4 text-xl font-semibold">Wagen</h3>
            {inDelivery.wagen.length === 0 ? (
              <p className="italic text-gray-500">Keine Wagen in Lieferung</p>
            ) : (
              <ul className="space-y-2">
                {inDelivery.wagen.map((wagen, index) => (
                  <li key={index} className="italic text-gray-300">
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