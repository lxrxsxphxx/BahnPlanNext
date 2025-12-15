import type { Route } from './+types/ausschreibungen';
import { usePlaceholder } from '@/components/placeholder';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'BahnPlanNext - Ausschreibungen' },
    { name: 'description', content: 'BahnPlan Next Ausschreibungen' },
  ];
}

export default function Ausschreibung() {
  const texte = usePlaceholder(20);

  return (
    <div className="flex flex-col gap-4">
      <h1>Ausschreibungen</h1>

      {texte}
    </div>
  );
}
