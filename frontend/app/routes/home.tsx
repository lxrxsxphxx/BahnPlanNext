import { useState } from 'react';
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from 'react-router';

import { type Props, WelcomeModal } from '../components/welcome/welcome-modal';
import type { Route } from './+types/home';
import { type OpenTender, getOpenTenders } from '@/services/tender';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const openTenders = await getOpenTenders();
  return {
    openTenders,
  };
}

export default function Home() {
  const { openTenders } = useLoaderData<typeof loader>();

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      {/* Offene Ausschreibungen */}
      <h1 className="mt-4 text-2xl font-bold">Neue Ausschreibungen</h1>
      <div>{JSON.stringify(openTenders)}</div>

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
