import { useEffect, useState } from "react";

interface Trasse {
  zugart: string;
  zugnummer: string;
  details: Record<string, any>;
  label: string;
}

interface TrassenGruppe {
  label: string;
  trassen: Trasse[];
}

type TrassenResponse = TrassenGruppe[];

export default function TrassenComponent() {

  const [trassen, setTrassen] = useState<TrassenResponse>([]);

  useEffect(() => {
    async function loadTrassen() {

      const res = await fetch(
        "http://localhost:8000/trassen"
      );

      const data: TrassenResponse = await res.json();
      setTrassen(data);
    }

    loadTrassen();
  }, [])

  return (

    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {trassen.map((group, groupIdx) => (
        <div
          key={groupIdx}
          className="bg-gray-800 rounded shadow-md p-4"
        >

          <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2 mb-4">
            {group.label}
          </h2>

          <div className="flex flex-col gap-4">
            {group.trassen.map((trasse, trasseIdx) => (
              <div
                key={trasseIdx}
                className="
                  flex justify-between
                bg-gray-700 rounded p-4 shadow-sm"
              >
                <div>

                <h3 className="text-lg font-semibold text-white">
                  {trasse.label}
                </h3>
                <p className="text-gray-300">
                  {trasse.zugart} {trasse.zugnummer}
                </p>
                </div>

                <button
                  className="
                    mt-2 px-3 py-1 bg-blue-600 text-white
                    rounded hover:bg-blue-700 cursor-pointer"
                  onClick={() => null } >kaufen</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
