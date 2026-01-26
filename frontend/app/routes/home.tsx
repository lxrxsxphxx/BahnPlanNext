import { useState } from 'react';

import { type Props, WelcomeModal } from '../components/welcome/welcome-modal';
import NeueAusschreibungen from '@/components/NeueAusschreibungen';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className='ml-64'>
      {/* Button, um das Welcome Modal anzuzeigen */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed top-18 right-4 rounded border border-black bg-white px-4 py-2 text-black transition hover:bg-black hover:text-white"
      >
        Welcome Modal anzeigen
      </button>

      {/* Welcome Modal */}
      <WelcomeModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Hauptinhalt der Home-Seite */}
      <h1 className="mt-4 text-2xl font-bold">Home Page Content</h1>
      <p>Hier kommt der restliche Inhalt deiner Homepage.</p>

      {/* Neue Ausschreibungen */}
      <NeueAusschreibungen />
    </div>
  );
}
