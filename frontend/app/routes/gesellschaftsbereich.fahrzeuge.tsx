import ShowLoks from '@/components/ShowLoks';
import { useWagon } from '@/components/wagen/add-wagen';
import { fetchCompaniesLoks, fetchCompanyInfo } from '@/services/gesellschaftsbereich';
import { useState } from 'react';
import { Link, useLoaderData } from 'react-router';
import WagonList from '@/components/wagen/wagen-list';


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
  const { myWagons } = useWagon();
  const [isWagonActive, setIsWagonActive] = useState(false);
  const cashBalance = company?.capital ?? 4000000;

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white p-8 ">
      <div className="mb-8">
        <h1 className="text-4xl font-bold"><Link to="/gesellschaftsbereich">Gesellschaftsbereich</Link> &gt; Meine Fahrzeuge</h1>
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
      <div className='mt-10 flex gap-6 items-end mb-6'>
        <button
          type="button"
          onClick={() => setIsWagonActive(false)}
          aria-pressed={!isWagonActive}
          className={`text-lg font-semibold ${!isWagonActive ? 'text-white border-b-4 border-blue-500 pb-2' : 'text-gray-400 pb-3'} hover:cursor-pointer`}
        >
          Loks
        </button>

        <button
          type="button"
          onClick={() => setIsWagonActive(true)}
          aria-pressed={isWagonActive}
          className={`text-lg font-semibold ${isWagonActive ? 'text-white border-b-4 border-blue-500 pb-2' : 'text-gray-400 pb-3'} hover:cursor-pointer`}
        >
          Wagen
        </button>
      </div>
      {!isWagonActive && (
        <ShowLoks loks={loks} error={error} />
      )}
      {!isWagonActive ? (
        <ShowLoks loks={loks} error={error} />
      ) : (
        <WagonList wagons={myWagons} />
      )}
    </div>
  );
}