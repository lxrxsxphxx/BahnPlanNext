import { useLoaderData } from 'react-router';

import type { Route } from './+types/Wagons';
import { API_BASE_URL } from '@/services/api';
import { getWagons } from '@/services/wagons';

export async function clientLoader({}: Route.ClientLoaderArgs) {
  const trassen = await getWagons();
  return { trassen };
}

export default function Wagons() {
  const wagons = useLoaderData<typeof clientLoader>();

  return (
    <div className="flex min-w-250 flex-col">
      <div>
        <h1 className="mb-4 text-3xl font-bold">Wagons</h1>
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        {' '}
        {wagons.trassen.map((wagon) => {
          const imagePath = `${API_BASE_URL}/static/${wagon.img_file}`;
          return (
            <div
              key={wagon.id}
              className="flex min-w-250 flex-col gap-2 rounded-xl bg-[#121C27] px-5 pt-2 pb-5"
            >
              <div className="text-lg text-[#D5DCE3] italic">
                {wagon.vehicle_number}
              </div>
              <div className="flex flex-row justify-between gap-5">
                <div>
                  <img src={imagePath} alt="Wagon" />
                </div>
                <div className="flex w-90 flex-col justify-between gap-1">
                  <div className="flex rounded border border-[#223041] bg-[#101822] px-5 py-1">
                    <div className="w-50 text-sm">Höchstgeschwindigkeit</div>
                    <div className="text-sm">{wagon.max_speed} km/h</div>
                  </div>
                  <div className="flex rounded border border-[#223041] bg-[#101822] px-5 py-1">
                    <div className="w-50 text-sm">Neupreis Standardwagen</div>
                    <div className="text-sm">{wagon.price_standard} €</div>
                  </div>
                  <div className="flex rounded border border-[#223041] bg-[#101822] px-5 py-1">
                    <div className="w-50 text-sm"> Neupreis Steuerwagen</div>
                    <div className="text-sm">{wagon.price_control} €</div>
                  </div>
                  <div className="flex rounded border border-[#223041] bg-[#101822] px-5 py-1">
                    <div className="w-50 text-sm">
                       Kilometerkosten (alle Arten)
                    </div>
                    <div className="text-sm">{wagon.cost_km! / 100} €/km</div>
                  </div>
                  <div className="flex rounded border border-[#223041] bg-[#101822] px-5 py-1">
                    <div className="w-50 text-sm"> Kapazität (alle Arten)</div>
                    <div className="text-sm">{wagon.capacity} Personen</div>
                  </div>
                </div>
                <div className="flex w-60 items-center justify-center">
                  <button className="cursor-pointer rounded-xl bg-[#15467D] px-5 py-1">
                    leasen
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
