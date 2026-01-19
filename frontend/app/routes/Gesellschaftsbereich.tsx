import type { Route } from './+types/Beschaffung';
import { NavLink } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Gesellschaftsbereich - BahnPlan' },
    { name: 'description', content: 'Kaufe Loks, Wagen, Trassen und mehr' },
  ];
}

export default function Gesellschaftsbereich() {
  const categories = [
    { name: 'Finanzen', path: '/gesellschaftsbereich/finanzen' },
    { name: 'Fahrzeuge', path: '/gesellschaftsbereich/fahrzeuge' },
    { name: 'Fahrpläne', path: '/gesellschaftsbereich/fahrplaene' },
  ];


  return (
    <div className="min-h-screen bg-[#0B0F14] text-white p-8 md:pl-58">
      <h1 className="mb-8 text-4xl font-bold">Gesellschaftsbereich</h1>

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

    </div>
  );
}