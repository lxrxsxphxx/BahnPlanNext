import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteLoaderData,
} from 'react-router';

import { ThemeProvider, useTheme } from 'remix-themes';

import type { Route } from './+types/root';
import globalStyleUrl from './app.css?url';
import { useThemeData } from './components/theme/theme-cookie';
import { MainLayout } from '@/components/structure/main-layout';
import { PreventFlashOnWrongTheme } from '@/components/theme/prevent-flash';
import { themeSessionResolver } from '@/sessions.server';

export const links: Route.LinksFunction = () => [
  {
    // faster stylesheet loading
    rel: 'preload',
    href: globalStyleUrl,
    as: 'style',
  },
  {
    rel: 'stylesheet',
    href: globalStyleUrl,
  },
  // { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  // {
  //   rel: 'preconnect',
  //   href: 'https://fonts.gstatic.com',
  //   crossOrigin: 'anonymous',
  // },
  // {
  //   rel: 'stylesheet',
  //   href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  // },
];

// Return the theme from the session storage using the loader
export async function loader({ request }: Route.LoaderArgs) {
  const { getTheme } = await themeSessionResolver(request);
  return {
    theme: getTheme(),
  };
}

function LayoutWithoutProvider({
  children,
  ssrTheme,
}: {
  children: React.ReactNode;
  ssrTheme: boolean;
}) {
  const [theme] = useTheme();

  return (
    <html lang="de" data-theme={theme ?? ''} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <PreventFlashOnWrongTheme ssrTheme={ssrTheme} type="data" />
        <Meta />
        <Links />
      </head>
      <body>
        <MainLayout>{children}</MainLayout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/**
 * Root Layout das gesamte App beinhaltet und die HTML Seite mit head und body rendert.
 */
export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>('root');
  const theme = useThemeData(data?.theme);

  return (
    <ThemeProvider
      specifiedTheme={theme}
      themeAction="/theme"
      disableTransitionOnThemeChange={true}
    >
      <LayoutWithoutProvider ssrTheme={Boolean(data?.theme)}>
        {children}
      </LayoutWithoutProvider>
    </ThemeProvider>
  );
}

/**
 * App Komponente als 'root' Route, welche in Root Layout gerendert wird.
 *
 * Hinweis: Wird bei hier in Root abgefangenen Exceptions nicht gerendert.
 */
export default function App({}: Route.ComponentProps) {
  return <Outlet />;
}

/**
 * Root Error Boundary um jegliche Exceptions abzufangen und auch Routing Fehler anzuzeigen.
 * Rendert in Root Layout
 */
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
