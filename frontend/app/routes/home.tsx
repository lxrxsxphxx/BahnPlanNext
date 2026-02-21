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

/**
 * **Home (Route Component)**
 * * Das Haupt-Dashboard von BahnplanNext. Diese Komponente aggregiert wichtige 
 * Informationen wie Ausschreibungen und bietet Zugang zum Onboarding-Tutorial.
 *
 * ### Funktionalitäten
 * - **Datenintegration**: Konsumiert Ausschreibungsdaten via `useLoaderData` und reicht sie an {@link TendersSection} weiter.
 * - **Onboarding-Trigger**: Verwaltet den Sichtbarkeitsstatus des {@link WelcomeModal}.
 * - **Hydration Management**: Nutzt den `clientLoader` von React-Router für performantes Client-seitiges Data Fetching.
 * - **Fehlerbehandlung**: Integriert eine {@link ErrorBoundary} zur Absicherung bei API-Fehlern.
 *
 * ### Logik & State
 * - `openTenders`: Array von {@link OpenTender}, das die aktuelle Wettbewerbslage widerspiegelt.
 * - `modalOpen`: Lokaler UI-State (`boolean`), der die Anzeige des Willkommens-Modals steuert.
 *
 * @category Routes
 */
export default function Home() {
  /** Die Liste der Ausschreibungen aus dem Loader.*/
  const { openTenders } = useLoaderData<typeof clientLoader>();
  console.log(openTenders);

  /** Status für das Welcome-Modal.*/
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
