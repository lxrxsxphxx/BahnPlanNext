import type { Route } from './+types/home';
import { usePlaceholder } from '@/components/placeholder';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'BahnPlanNext - Homepage' },
    { name: 'description', content: 'Welcome to BahnPlan Next!' },
  ];
}

export default function Home() {
  const texte = usePlaceholder(20);

  return (
    <div className="flex flex-col gap-4">
      <h1>BahnPlan Next - Homepage</h1>

      {texte}
    </div>
  );
}
