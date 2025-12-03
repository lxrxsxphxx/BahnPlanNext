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
import { useModal } from './components/modal/useModal';
import { Modal } from './components/modal/modal';
import { useState } from 'react';

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

  const {open, show, hide, close} = useModal();

  // Two-way-binding states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordWied, setPasswordWied] = useState("");


  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          onClick={() => show()}>
          Open Modal
        </button>

        <Modal open={open} onClose={() => close()}>

        <div className="text-black">
          <h2 className="text-xl font-bold mb-4">Registrierung</h2>
          <form className="flex flex-col gap-3">
            <input type="text" placeholder="Name*" className="border p-2 rounded" value={name}
                onChange={(e) => setName(e.target.value)} required/>
            <input type="email" placeholder="Email*" className="border p-2 rounded" value={email}
                onChange={(e) => setEmail(e.target.value)} required/>
            <input type="password" placeholder="Passwort*" className="border p-2 rounded" value={password}
                onChange={(e) => setPassword(e.target.value)} required/>
            <input type="password" placeholder="Passwort wiederholen*" className="border p-2 rounded" value={passwordWied}
                onChange={(e) => setPasswordWied(e.target.value)} required/>

          </form>
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
