import { useState } from 'react';
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from 'react-router';

import { WelcomeModal } from '../components/welcome/welcome-modal';
import type { Route } from './+types/home';
import TendersSection from '@/components/tenders/TendersSection';
import { getOpenTenders } from '@/services/tender';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'BahnplanNext Homepage' },
    { name: 'description', content: 'Willkommen bei BahnplanNext' },
  ];
}

export async function loader({ }: Route.LoaderArgs) {
  return {
    openTenders: [],
  };
}

export async function clientLoader({ }: Route.ClientLoaderArgs) {
  console.log('fetch open tenders');
  const openTenders = await getOpenTenders();
  return {
    openTenders,
  };
}
clientLoader.hydrate = true as const;

export default function Home() {
  const { openTenders } = useLoaderData<typeof clientLoader>();
  console.log(openTenders);

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      {/* Offene Ausschreibungen */}
      <TendersSection openTenders={openTenders} />

      {/* Button, um das Welcome Modal anzuzeigen */}
      <button
        onClick={() => setModalOpen(true)}
        className="rounded border border-black bg-white px-4 py-2 text-black transition hover:bg-black hover:text-white"
      >
        Welcome Modal anzeigen
      </button>

      {/* Welcome Modal */}
      <WelcomeModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  let message: string;
  if (isRouteErrorResponse(error)) {
    message = `Error: ${error.statusText} (${error.status})`;
  } else if (error instanceof Error) {
    message = `Error: ${error.message}`;
  } else {
    message = 'Unknown Error';
  }

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}
