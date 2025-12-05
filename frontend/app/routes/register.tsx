import { useState } from "react";
// import Welcome from "../components/welcome/welcome";

export default function Register() {
  const [showWelcome, setShowWelcome] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowWelcome(true); 
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-3  justify-center text-center ">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="email" placeholder="Email" className="p-2 border rounded" required />
        <input type="password" placeholder="Password" className="p-2 border rounded" required />
        <button type="submit" className="py-2 bg-black text-white rounded">Submit</button>
      </form>

      {/* <Welcome open={showWelcome} onClose={() => setShowWelcome(false)} /> */}
    </div>
  );
}
