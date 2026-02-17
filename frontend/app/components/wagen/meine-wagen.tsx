"use client";

import WagenCard, { type Wagen } from "./WagenCard";

interface ShowWagenProps {
  wagenList: Wagen[];
  lokList: any[];
  lokAssignments: Record<number, number>;
  assignedWagenCount: Record<number, number>;
  onLokAssignmentChange: (
    lokAssignments: Record<number, number>,
    assignedWagenCount: Record<number, number>,
    geleasterWagen?: { id: number; name: string }
  ) => void;
  cashBalance: number;
}

export default function ShowWagen({ wagenList, lokList, lokAssignments, assignedWagenCount, onLokAssignmentChange, cashBalance }: ShowWagenProps) {
  const geleasteWagen = wagenList.filter((wagen) =>
    Object.values(lokAssignments).includes(wagen.id)
  );

  return (
    <>
      {geleasteWagen.length > 0 ? (
        <div className="space-y-6">
          {geleasteWagen.map((wagen) => (
            <WagenCard
              key={wagen.id}
              wagen={wagen}
              cashBalance={cashBalance}
              lokList={lokList}
              lokAssignments={lokAssignments}
              assignedWagenCount={assignedWagenCount}
              onLokAssignmentChange={onLokAssignmentChange}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-md bg-yellow-500/20 p-4 text-yellow-200">
          <p>Du hast derzeit noch keine Wagen geleast.</p>
        </div>
      )}
    </>
  );
}
