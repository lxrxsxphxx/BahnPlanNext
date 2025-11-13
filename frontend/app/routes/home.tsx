import { useState } from "react";
import Welcome from '../components/welcome/welcome';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true); // mặc định hiển thị modal

  return (
    <div>
      <Welcome open={showWelcome} onClose={() => setShowWelcome(false)} />
      <h1 className="text-2xl font-bold mt-4">Home Page Content</h1>
      <p>Hier kommt der restliche Inhalt deiner Homepage.</p>
    </div>
  );
}
