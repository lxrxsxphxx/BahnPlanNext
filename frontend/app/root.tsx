import { useEffect, useState } from 'react';
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
import Navbar from './components/navbar/Navbar';
import { checkLoggedIn, logout } from './services/auth';

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

/**
 * **Root Layout & App-Konfiguration**
 *
 * Die zentrale Einstiegsdatei der Anwendung "BahnPlanNext". Sie definiert das globale HTML-Gerüst,
 * verwaltet den Authentifizierungsstatus und implementiert das hybride Navigationskonzept.
 *
 * ### Design-Philosophie: Navbar vs. Sidebar
 * Um die User Experience eines Management-Spiels zu optimieren, nutzt die App zwei Navigationsebenen:
 * - **Horizontale Navbar (Top)**: Fungiert als "Meta-Ebene". Sie ist zuständig für globale 
 * Aktionen wie Login, Logout und Profilverwaltung. Dies hält den Kopfbereich für systemweite 
 * Informationen sauber.
 * - **Vertikale Sidebar (Links, via `ml-56`)**: Fungiert als "Operative Ebene". Sie ermöglicht 
 * den schnellen Wechsel zwischen den Kernmodulen des Spiels (Fahrzeuge, Finanzen, Shop). 
 * Der feste linke Abstand (`ml-56`) reserviert den Platz für diese dauerhaft präsente Navigation.
 *
 * ### Funktionalitäten
 * - **Zentrales Auth-Management**: Verwaltet den `isLoggedIn`-Status und stellt Handler für 
 * Login-Erfolg und Logout bereit, die an die Navbar delegiert werden.
 * - **Scroll-Restoration**: Stellt sicher, dass die Scrollposition beim Navigieren zwischen 
 * den Spielmodulen erhalten bleibt.
 * - **Error Boundary**: Ein robustes Sicherheitsnetz, das 404-Fehler und Laufzeitfehler abfängt 
 * und im Entwicklungsmodus detaillierte Stack-Traces zur Fehlersuche anzeigt.
 *
 * ### Logik & State-Management
 * - **checkLoggedIn (Effect)**: Validiert beim Initialisieren der App die bestehende Sitzung 
 * über den `auth`-Service. Nutzt ein `isMounted`-Flag, um Memory Leaks zu vermeiden.
 * - **Responsive Layout**: Der Inhaltsbereich (`children`) ist durch `ml-56` nach rechts 
 * verschoben, um eine Überlagerung durch die fixierte Sidebar zu verhindern.
 *
 * ### Fehlerbehandlung (ErrorBoundary)
 * Unterscheidet zwischen:
 * 1. **Routing-Fehlern**: Anzeige von 404-Meldungen, falls eine Strecke nicht existiert.
 * 2. **System-Fehlern**: Anzeige von Fehlermeldungen und Code-Ausschnitten für Entwickler.
 *
 * @category Core / Layout
 * @example
 * ```tsx
 * // Das Layout umschließt alle Routen automatisch über das <Outlet />.
 * <Layout>
 * <Dashboard />
 * </Layout>
 * ```
 */

export function Layout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let isMounted = true;

    checkLoggedIn().then((loggedIn) => {
      if (!isMounted) return;
      setIsLoggedIn(loggedIn);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoginSuccess = async () => {
    const loggedIn = await checkLoggedIn();
    setIsLoggedIn(loggedIn);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setIsLoggedIn(false);
    }
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="overflow-x-hidden">
        <Navbar
          isLoggedIn={isLoggedIn}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
        />
        <div className="ml-56">{children}</div>
        <ScrollRestoration />
        <Scripts />
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
