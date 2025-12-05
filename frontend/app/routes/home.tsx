import { useState } from "react";
import type { Route } from './+types/home';
import WelcomeModal from "../components/welcome/WelcomeModal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(true); // modal mở mặc định

  return (
    <div>
      {/* Welcome Modal */}
      <WelcomeModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Home */}
      <h1 className="text-2xl font-bold mt-4">Home Page Content</h1>
      <p>Hier kommt der restliche Inhalt deiner Homepage.</p>
    </div>
  );
}
