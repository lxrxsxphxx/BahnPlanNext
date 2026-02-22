import { useState } from 'react';
import { Link, useLoaderData } from 'react-router';

import ShowLoks from '@/components/ShowLoks';
import {
  fetchCompaniesLoks,
  fetchCompanyInfo,
} from '@/services/gesellschaftsbereich';

export async function clientLoader() {
  try {
    const loks = await fetchCompaniesLoks();
    const company = await fetchCompanyInfo();
    // Debug: show raw payload so missing fields can be inspected in browser console
    // Remove or guard this in production.
    // eslint-disable-next-line no-console
    console.debug('clientLoader: company, loks', { company, loks });
    return { loks, company };
  } catch (err) {
    console.error('Fehler beim Laden der Loks im Loader:', err);
    return {
      error: (err as Error).message || 'Fehler beim Laden der Loks',
    };
  }
}

export default function GesellschaftsbereichFahrzeuge() {
  const { loks, company, error } = useLoaderData<typeof clientLoader>();
  const [isWagonActive, setIsWagonActive] = useState(false);
  const cashBalance = company?.capital ?? 4000000;

  return (
    <div className="min-h-screen bg-[#0B0F14] p-8 text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          <Link to="/gesellschaftsbereich">Gesellschaftsbereich</Link> &gt;
          Meine Fahrzeuge
        </h1>
        {error && (
          <div className="mt-4 rounded-md bg-red-500/20 p-4 text-red-200">
            <p>
              Fehler beim Laden der Fahrzeuge aus der Datenbank. Fehler: {error}
            </p>
          </div>
        )}
        {company?.name && (
          <div className="mb-4 flex items-center justify-between">
            <div className="text-2xl text-gray-300">{company.name}</div>
            <div className="rounded-md bg-gray-800 px-4 py-2 text-sm">
              {cashBalance.toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR',
              })}
            </div>
          </div>
        )}
      </div>
      <div className="mt-10 mb-6 flex items-end gap-6">
        <button
          type="button"
          onClick={() => setIsWagonActive(false)}
          aria-pressed={!isWagonActive}
          className={`text-lg font-semibold ${!isWagonActive ? 'border-b-4 border-blue-500 pb-2 text-white' : 'pb-3 text-gray-400'} hover:cursor-pointer`}
        >
          Loks
        </button>

        <button
          type="button"
          onClick={() => setIsWagonActive(true)}
          aria-pressed={isWagonActive}
          className={`text-lg font-semibold ${isWagonActive ? 'border-b-4 border-blue-500 pb-2 text-white' : 'pb-3 text-gray-400'} hover:cursor-pointer`}
        >
          Wagen
        </button>
      </div>
      {!isWagonActive && <ShowLoks loks={loks} error={error} />}
      {isWagonActive && (
        <div className="mt-6 rounded-md bg-yellow-500/20 p-4 text-yellow-200">
          <p>
            Der Wagen-Bereich ist derzeit noch in Entwicklung. Bitte hab etwas
            Geduld, während wir daran arbeiten, dir bald auch deine Wagen
            anzuzeigen!
          </p>
        </div>
      )}
    </div>
  );
}
