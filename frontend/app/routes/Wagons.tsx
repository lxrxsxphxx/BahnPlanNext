import { useLoaderData } from "react-router";
import type { Route } from "../+types/root";
import { API_BASE_URL } from "@/services/api"
import { getWagons } from "@/services/wagons";


export async function loader({ }: Route.LoaderArgs) {
  return { trassen: [] };
}

export async function clientLoader({ }: Route.ClientLoaderArgs) {

  const trassen = await getWagons();
  return { trassen };
}
clientLoader.hydrate = true as const;

export default function Wagons() {

  const wagons = useLoaderData<typeof clientLoader>();

  return (
    <div className="flex flex-col min-w-250">
      <div>
        <h1 className="text-3xl font-bold mb-4">Wagons</h1>
      </div>

      <div className="flex flex-col gap-4 items-center justify-center"> {
        wagons.trassen.map((wagon) => {
          const imagePath = `${API_BASE_URL}/static/${wagon.img_file}`;
          return (
            <div className="flex flex-col gap-2 bg-[#121C27] rounded-xl min-w-250 px-5 pt-2 pb-5">
              <div className="text-lg italic text-[#D5DCE3]">
                {wagon.vehicle_number}
              </div>
              <div className="flex flex-row gap-5 justify-between">
                <div>
                  <img src={imagePath} alt="Wagon" />
                </div>
                <div className="flex flex-col gap-1 justify-between w-90">
                  <div className="flex rounded border border-[#223041] bg-[#101822] px-5 py-1">
                    <div className="text-sm w-50">Höchstgeschwindigkeit</div>
                    <div className="text-sm">{wagon.max_speed} km/h</div>
                  </div>
                  <div className="flex rounded border border-[#223041] bg-[#101822] px-5 py-1">
                    <div className="text-sm w-50">Neupreis Standardwagen</div>
                    <div className="text-sm">{wagon.price_standard} €</div>
                  </div>
                  <div className="flex rounded border border-[#223041] bg-[#101822] px-5 py-1">
                    <div className="text-sm w-50"> Neupreis Steuerwagen</div>
                    <div className="text-sm">{wagon.price_control} €</div>
                  </div>
                  <div className="flex rounded border border-[#223041] bg-[#101822] px-5 py-1">
                    <div className="text-sm w-50"> Kilometerkosten (alle Arten)</div>
                    <div className="text-sm">{wagon.cost_km! / 100} €/km</div>
                  </div>
                  <div className="flex rounded border border-[#223041] bg-[#101822] px-5 py-1">
                    <div className="text-sm w-50"> Kapazität (alle Arten)</div>
                    <div className="text-sm">{wagon.capacity} Personen</div>
                  </div>


                </div>
                <div className="flex justify-center items-center w-60">
                  <button className="rounded-xl px-5 py-1 cursor-pointer bg-[#15467D]">leasen</button>
                </div>

              </div>

            </div>
          )
        })
      }</div>

    </div>
  );

}
