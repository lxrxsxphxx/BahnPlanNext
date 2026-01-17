import { useState } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from 'react-router';

import type { Route } from './+types/root';
import './app.css';
import { Modal } from './components/modal/modal';
import { useModal } from './components/modal/useModal';
import Navbar from './components/navbar/Navbar';
import RegistrationForm from './components/registration/RegistrationForm';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { open, show, hide, close } = useModal();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar onRegisterClick={show} />
        {children}
        <ScrollRestoration />
        <Scripts />

        <button
          className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => show()}
        >
          Open Modal
        </button>

        <Modal open={open} onClose={() => close()}>
          <div className="relative text-black">
            <button
              type="button"
              onClick={close}
              className="absolute top-3 right-3 text-xl text-gray-500 hover:text-black"
              aria-label="Modal schließen"
            >
              ✕
            </button>

            <h2 className="mb-4 text-xl font-bold">Registrierung</h2>

            <RegistrationForm onSuccess={close} resetTrigger={!open} />
          </div>
        </Modal>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
