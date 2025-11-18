import { type PropsWithChildren } from 'react';
import { Outlet } from 'react-router';

import Navbar from './navbar';
import Sidebar from './sidebar';

/**
 * Hauptlayout als Komponente.
 * Wird in Root Layout verwendet, um außerhalb des Routings immer angezeigt zu werden.
 */
export function MainLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <div className="layout-content">
        <Sidebar />
        <main className="flex-auto shrink p-6">{children}</main>
      </div>
    </>
  );
}

// temporär noch da gelassen, falls die Komponente doch als Route Layout verwendet wird
export default function Layout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
