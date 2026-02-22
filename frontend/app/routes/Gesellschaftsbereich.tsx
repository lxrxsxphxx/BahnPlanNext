import { useState } from 'react';
import { NavLink } from 'react-router';

import { createGesellschaft } from '@/services/gesellschaft';

interface Props {
  onSuccess: (gesellschaft: any) => void;
}

export function CreateGesellschaftForm({ onSuccess }: Props) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validate = () => {
    const regex = /^[A-Za-z0-9.,\-()!? ]+$/;

    if (!regex.test(name)) {
      setError('Nur Buchstaben, Zahlen und Standard-Satzzeichen erlaubt');
      return false;
    }

    if (name.length < 3) {
      /* vielleicht länger? nochmal nachfragen*/
      setError('Name zu kurz');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const company = await createGesellschaft(name);
      setSuccess('Gesellschaft erfolgreich erstellt!');
      setError('');
      onSuccess(company);
    } catch (err) {
      setSuccess('');
      setError('Fehler bei der Erstellung der Gesellschaft' + err);
      console.log(err);
    }
  };

  return (
    <div className="mt-15px rounded-2xl border bg-[#121C27] p-8 text-white">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Gesellschaft erstellen
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          value={name}
          type="text"
          onChange={(e) => setName(e.target.value)}
          placeholder="Gesellschaftsname"
          className="mb-1 w-full rounded-md border border-gray-500 px-3 py-2"
          required
        />

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="font-semibold text-green-500">{success}</p>}

        <button
          type="submit"
          className="w-full rounded-md bg-[#284771] px-3 py-2"
        >
          Erstellen
        </button>
      </form>
    </div>
  );
}

export function gesellschaftErstellenHinweis() {
  return (
    <div className="min-h-screen rounded-md border-1 border-gray-500 bg-[#121C27] p-8">
      <div>
        <p className="font-bold">
          {' '}
          Bitte achte darauf,{' '}
          <span className="text-red-500"> keine reale Gesellschaft</span>{' '}
          einzutragen - solche Eintragungen werden aus rechtlichen Gründen
          umgehend gelöscht!{' '}
        </p>
        <p className="mb-3">
          Bitte wähle auch keine Gesellschaft, die einmal existiert hat; oftmals
          sind auch da noch Namensrechte existent!
        </p>
        <p>
          Nach dem Absenden können die Daten nicht mehr geändert werden, daher
          achte bitte auf Fehlerfreiheit und darauf, dass der Gesellschaftsname
          noch nicht existiert.
        </p>
        <p className="mb-5">
          Die bereits vergebenen Gesellschaftsnamen kannst du in der Suchleiste
          einsehen.{' '}
        </p>
        <p className="mb-10">
          Erlaubt sind nur: A-Z, a-z, 0-9 und Standard-Satzzeichen.
        </p>
        <div>
          <CreateGesellschaftForm
            onSuccess={(g) => console.log('created', g)}
          />
        </div>
        <p className="mt-5 mb-5">
          {' '}
          Zudem lohnt es sich,{' '}
          <NavLink to="/Regeln" className="text-blue-500">
            Regeln
          </NavLink>{' '}
          und
          <NavLink to="/faq" className="text-blue-500">
            {' '}
            FAQ
          </NavLink>{' '}
          durchzulesen.
        </p>
        <p className="mt-5">
          Nach erfolgreicher Erstellung wird die Gesellschaft mit einem{' '}
          <span className="color-white font-bold">
            Startguthaben von 4 Mio.€
          </span>{' '}
          registriert.
        </p>
      </div>
    </div>
  );
}

/*entscheiden, ob sich gesellschaftErstellenHinweis öffnet oder Weiterleitung zu Dashboard */
export default function Gesellschaftsbereich() {
  const [userCompany, setUserCompany] = useState<any | null>(null);

  //Gesellschaft existiert nicht
  if (!userCompany) {
    return (
      <div className="min-h-screen bg-[#0B0F14] p-8 text-white">
        <h1 className="mb-8 text-4xl font-bold">Gesellschaftsbereich</h1>
        {gesellschaftErstellenHinweis()}
      </div>
    );
  }

  //Gesellschaft existiert
  return (
    /* Hier weitere Inhalte für den Gesellschaftsbereich einfügen*/
    <div className="min-h-screen bg-[#0B0F14] p-8 text-white">
      <h1 className="mb-8 text-4xl font-bold">Gesellschaftsbereich</h1>
    </div>
  );
}
