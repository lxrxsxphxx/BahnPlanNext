type Tender = {
  id: number;
  title: string;
  status: string;
  sections: string[];
};

const EXAMPLE_TENDERS: Tender[] = [
  { id: 1, title: 'Ausschreibung 1', status: 'offen', sections: ['DEU-001', 'DEU-101'] },
  { id: 2, title: 'Ausschreibung 2', status: 'geschlossen', sections: ['DEU-050'] },
  { id: 3, title: 'Ausschreibung 3', status: 'offen', sections: ['AT-200', 'AT-205', 'AT-210'] },
  { id: 4, title: 'Ausschreibung 4', status: 'laufend', sections: ['DEU-300'] },
];

export default function NeueAusschreibungen() {
  const tenders = EXAMPLE_TENDERS.filter((t) => (t.status ?? '').toLowerCase() === 'offen').slice(0, 5);

  return (
    <section className="mt-8 rounded-2xl border border-blue-500/50 bg-gray-800 p-6 text-white">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Neue Ausschreibungen</h2>
      </div>

      {tenders.length === 0 && (
        <div className="text-gray-300">Aktuell keine offenen Ausschreibungen.</div>
      )}

      {tenders.length > 0 && (
        <div className="divide-y divide-gray-700 rounded-md border border-gray-700 bg-gray-900">
          {tenders.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="font-medium text-gray-100">{t.title}</div>
                <div className="text-sm text-gray-400">
                  Streckenabschnitte: {t.sections && t.sections.length ? t.sections.join(', ') : '—'}
                </div>
              </div>
              <div>
                <button className="rounded-md bg-gray-700 px-3 py-1.5 text-sm text-white hover:bg-gray-600" disabled>
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
