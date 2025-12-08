import { Outlet } from 'react-router';

import type { Route } from './+types/index';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'BahnPlanNext - Betrieb' },
    { name: 'description', content: 'BahnPlan Next Bereich Betrieb' },
  ];
}

export default function Ausschreibung() {
  return (
    <div className="flex flex-col gap-4">
      <h1>Betrieb</h1>

      <Outlet />
    </div>
  );
}
