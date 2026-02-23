import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';

import type { Route } from './+types/Beschaffung';
import { createCompany } from '@/services/gesellschaftsbereich';
import { fetchCompanyInfo2 } from '@/services/gesellschaftsbereich';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Gesellschaftsbereich - BahnPlan' },
    { name: 'description', content: 'Kaufe Loks, Wagen, Trassen und mehr' },
  ];
}

export default function Gesellschaftsbereich() {
  const categories = [
    { name: 'Finanzen', path: '/gesellschaftsbereich/finanzen' },
    { name: 'Fahrzeuge', path: '/gesellschaftsbereich/fahrzeuge' },
    { name: 'Fahrpläne', path: '/gesellschaftsbereich/fahrplaene' },
  ];
  const [userCompany, setUserCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyInfo2()
      .then((company) => {
        console.log('Geladene Gesellschaft:', company);
        setUserCompany(company ?? null);
      })
      .catch((err) => {
        console.error('Fehler beim Laden der gesellschaft:', err);
        setUserCompany(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Lade Unternehmensinformationen...</p>;
  }

  if (!userCompany || !userCompany.in_company) {
    return (
      <div className="min-h-screen bg-[#0B0F14] p-8 text-white">
        <h1 className="mb-8 text-4xl font-bold">Gesellschaftsbereich</h1>
        {gesellschaftErstellenHinweis()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] p-8 text-white">
      <h1 className="mb-8 text-4xl font-bold">Gesellschaftsbereich: </h1>
      {/* Kategorien Abschnitt */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.name}
            className="rounded-lg border border-[#223041] bg-[#121C27] p-8 transition-colors hover:border-gray-600"
          >
            <h2 className="mb-6 text-2xl font-semibold">{category.name}</h2>
            <NavLink
              to={category.path}
              className={({ isActive }: { isActive: boolean }) =>
                `inline-block rounded-md px-6 py-2 text-sm font-medium transition-colors ` +
                (isActive ? 'bg-gray-600' : 'bg-gray-700 hover:bg-gray-600')
              }
            >
              Details
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  onSuccess: (gesellschaft: any) => void;
}

export function CreateCompanyForm({ onSuccess }: Props) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      navigate('/gesellschaftsbereich');
    }, 2000);

    return () => clearTimeout(timer);
  }, [success, navigate]);

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
      const company = await createCompany(name);
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
    <div className="mt-4 rounded-2xl border bg-[#121C27] p-8 text-white">
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
          <CreateCompanyForm onSuccess={(g) => console.log('created', g)} />
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
