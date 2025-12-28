import { useEffect, useState } from 'react';

import { login } from '@/services/auth';

export default function LoginForm({ onClose }: { onClose?: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Load saved credentials from localStorage on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('loginForm_username');
    const savedPassword = localStorage.getItem('loginForm_password');
    if (savedUsername) setUsername(savedUsername);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  // Save credentials to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('loginForm_username', username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem('loginForm_password', password);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username === '' || password === '') {
      setError('Bitte füllen Sie alle Felder aus.');
    } else {
      setError(null);
      console.log('Anmeldeversuch mit:', { username, password });
      try {
        await login(username, password);
      } catch (err) {
        setError(
          'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.' + err,
        );
      }
    }
  };

  return (
    <div className="relative text-white">
      <button
        type="button"
        aria-label="Modal schließen"
        className="absolute top-0 right-0 text-2xl text-gray-300 transition-colors hover:cursor-pointer hover:text-white"
        onClick={() => onClose?.()}
      >
        X
      </button>

      <h2 className="mb-8 text-center text-3xl font-bold italic">Login</h2>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-300">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full rounded-xl border border-gray-600 bg-gray-700/50 py-3.5 pr-4 pl-12 text-white placeholder-gray-400 transition focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Benutzername/Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="relative">
          <div className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-300">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            className="w-full rounded-xl border border-gray-600 bg-gray-700/50 py-3.5 pr-12 pl-12 text-white placeholder-gray-400 transition focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-300 transition-colors hover:text-white"
            aria-label={
              showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'
            }
          >
            {showPassword ? (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:cursor-pointer hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Login
        </button>

        {error && <p className="text-center text-sm text-red-400">{error}</p>}

        <p className="mt-6 text-center text-sm text-gray-300">
          Kein Account?{' '}
          <button
            type="button"
            className="underline transition-colors hover:text-white"
            onClick={() => {
              console.log('Navigation zur Registrierung');
            }}
          >
            Registrieren
          </button>
        </p>
      </form>
    </div>
  );
}
