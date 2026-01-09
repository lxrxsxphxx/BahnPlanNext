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

  // Two-way-binding states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordWied, setPasswordWied] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Benutzername ist erforderlich';
    else if (!/^[a-zA-Z0-9]+$/.test(name))
      newErrors.name = 'Nur Buchstaben und Zahlen erlaubt';
    else if (name.length < 3) newErrors.name = 'Benutzername ist zu kurz';

    if (!email.trim()) newErrors.email = 'E-Mail ist erforderlich';
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = 'Ungültige E-Mail-Adresse';

    if (!password) newErrors.password = 'Passwort ist erforderlich';
    else if (password.length < 10) newErrors.password = 'Mindestens 10 Zeichen';
    else if (password.length >= 128)
      newErrors.password = 'Höchstens 128 Zeichen';

    if (!passwordWied) newErrors.passwordWied = 'Bitte Passwort wiederholen';
    else if (password !== passwordWied)
      newErrors.passwordWied = 'Passwörter stimmen nicht überein';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    close();
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar />
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
          <div className="text-black">
            <h2 className="mb-4 text-xl font-bold">Registrierung</h2>
            <form
              className="flex flex-col gap-3"
              id="registerForm"
              noValidate
              onSubmit={handleSubmit}
            >
              <label>
                Benutzername:
                <br />
                <input
                  type="text"
                  placeholder="Name*"
                  id="Benutzername"
                  className={'rounded border p-2 invalid:border-red-500'}
                  minLength={3}
                  maxLength={20}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
              <label>
                Email:
                <br />
                <input
                  type="email"
                  placeholder="Email*"
                  id="Email"
                  className="rounded border p-2 invalid:border-red-500"
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
              <label>
                Passwort:
                <br />
                <input
                  type="password"
                  placeholder="Passwort*"
                  id="Passwort"
                  className="rounded border p-2 invalid:border-red-500"
                  minLength={10}
                  maxLength={128}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
              <label>
                Passwort wiederholen:
                <br />
                <input
                  type="password"
                  placeholder="Passwort wiederholen*"
                  id="PasswortWied"
                  className="rounded border p-2 invalid:border-red-500"
                  minLength={10}
                  maxLength={128}
                  value={passwordWied}
                  onChange={(e) => setPasswordWied(e.target.value)}
                  required
                />
              </label>
              {errors.passwordWied && (
                <p className="text-sm text-red-500">{errors.passwordWied}</p>
              )}
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
