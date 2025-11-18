import { Outlet } from 'react-router';

import type { Route } from './+types/index';
import { usePlaceholder } from '@/components/placeholder';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'BahnPlanNext - Fahrpläne' },
    {
      name: 'description',
      content: 'BahnPlan Next Bereich Betrieb - Fahrpläne',
    },
  ];
}

export default function Fahrplaene() {
  const texte = usePlaceholder(20);

  return (
    <div className="flex flex-col gap-4">
      <h2>Fahrpläne</h2>

      {texte}

      <Outlet />
    </div>
  );
}
