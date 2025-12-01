import { type PropsWithChildren } from 'react';
import { Outlet } from 'react-router';

import { Navbar } from './navbar';
import { AppSidebar, SidebarAnimatedInset } from './sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

/**
 * Hauptlayout als Komponente.
 * Wird in Root Layout verwendet, um außerhalb des Routings immer angezeigt zu werden.
 */
export function MainLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarAnimatedInset>
        <Navbar />
        <main className="flex-auto shrink p-6">{children}</main>
      </SidebarAnimatedInset>
    </SidebarProvider>
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
