import { useState } from "react";
import Welcome from '../components/welcome/welcome';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true); 

  return (
    <div>
      <Welcome open={showWelcome} onClose={() => setShowWelcome(false)} />
      <h1 className="text-2xl font-bold mt-4">Home Page Content</h1>
      <p>Hier kommt der restliche Inhalt deiner Homepage.</p>
    </div>
  );
}