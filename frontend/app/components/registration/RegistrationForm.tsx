// src/components/registration/RegistrationForm.tsx
import { useEffect, useState } from 'react';

import type {
  RegistrationErrors,
  RegistrationFormValues,
} from './registration.types';

interface RegistrationFormProps {
  onSuccess: () => void;
  resetTrigger?: boolean; // wird true, wenn Modal geschlossen wird
}

// Validierungsfunktion
export function validate(
  values: RegistrationFormValues,
  setErrors: (errors: RegistrationErrors) => void,
): boolean {
  const { name, email, password, passwordWied } = values;
  const newErrors: RegistrationErrors = {};

  // Benutzername
  if (!name.trim()) newErrors.name = 'Benutzername ist erforderlich';
  else if (!/^[a-zA-Z0-9]+$/.test(name))
    newErrors.name = 'Nur Buchstaben und Zahlen erlaubt';
  else if (name.length < 3) newErrors.name = 'Benutzername ist zu kurz';
  else if (name.length > 20) newErrors.name = 'Benutzername ist zu lang';

  // Email
  if (!email.trim()) newErrors.email = 'E-Mail ist erforderlich';
  else if (!/\S+@\S+\.\S+/.test(email))
    newErrors.email = 'Ungültige E-Mail-Adresse';

  // Passwort
  if (!password) newErrors.password = 'Passwort ist erforderlich';
  else if (password.length < 10) newErrors.password = 'Mindestens 10 Zeichen';
  else if (password.length > 128) newErrors.password = 'Höchstens 128 Zeichen';

  // Passwort wiederholen
  if (!passwordWied) newErrors.passwordWied = 'Bitte Passwort wiederholen';
  else if (password !== passwordWied)
    newErrors.passwordWied = 'Passwörter stimmen nicht überein';

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
}

export default function RegistrationForm({
  onSuccess,
  resetTrigger,
}: RegistrationFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordWied, setPasswordWied] = useState('');
  const [errors, setErrors] = useState<RegistrationErrors>({});

  // Reset der Felder, wenn Modal geschlossen wird
  useEffect(() => {
    if (resetTrigger) {
      setName('');
      setEmail('');
      setPassword('');
      setPasswordWied('');
      setErrors({});
    }
  }, [resetTrigger]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validate(
      { name, email, password, passwordWied },
      setErrors,
    );
    if (!isValid) return;

    // Alles korrekt, Erfolg
    onSuccess();
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
      {/* Benutzername */}
      <label htmlFor="Benutzername">Benutzername:</label>
      <input
        type="text"
        id="Benutzername"
        placeholder="Name*"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`rounded border p-2 ${errors.name ? 'border-red-500' : ''}`}
        minLength={3}
        maxLength={20}
        required
      />
      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

      {/* Email */}
      <label htmlFor="Email">Email:</label>
      <input
        type="email"
        id="Email"
        placeholder="Email*"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`rounded border p-2 ${errors.email ? 'border-red-500' : ''}`}
        maxLength={254}
        required
      />
      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

      {/* Passwort */}
      <label htmlFor="Passwort">Passwort:</label>
      <input
        type="password"
        id="Passwort"
        placeholder="Passwort*"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`rounded border p-2 ${
          errors.password ? 'border-red-500' : ''
        }`}
        minLength={10}
        maxLength={128}
        required
      />
      {errors.password && (
        <p className="text-sm text-red-500">{errors.password}</p>
      )}

      {/* Passwort wiederholen */}
      <label htmlFor="PasswortWied">Passwort wiederholen:</label>
      <input
        type="password"
        id="PasswortWied"
        placeholder="Passwort wiederholen*"
        value={passwordWied}
        onChange={(e) => setPasswordWied(e.target.value)}
        className={`rounded border p-2 ${
          errors.passwordWied ? 'border-red-500' : ''
        }`}
        minLength={10}
        maxLength={128}
        required
      />
      {errors.passwordWied && (
        <p className="text-sm text-red-500">{errors.passwordWied}</p>
      )}

      <button
        type="submit"
        className="mt-4 rounded-xl bg-blue-600 py-2 text-white hover:bg-blue-700"
      >
        Registrieren
      </button>
    </form>
  );
}
