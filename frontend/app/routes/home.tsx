import { useState } from "react";
import type { Route } from './+types/home';
import WelcomeModal, { type Props as WelcomeModalProps } from "../components/welcome/WelcomeModal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
       {/* Button, um das Welcome Modal anzuzeigen */}
      <button
        onClick={() => setModalOpen(true)}
        className="
          fixed top-18 right-4
          px-4 py-2 
          border border-black 
          text-black 
          bg-white 
          rounded 
          transition 
          hover:bg-black 
          hover:text-white
        "
      >
        Welcome Modal anzeigen
      </button>

      {/* Welcome Modal */}
      <WelcomeModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Hauptinhalt der Home-Seite */}
      <h1 className="text-2xl font-bold mt-4">Home Page Content</h1>
      <p>Hier kommt der restliche Inhalt deiner Homepage.</p>
    </div>
  );
}
