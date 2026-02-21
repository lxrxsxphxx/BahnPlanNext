import Tender from './Tender';
import { type OpenTender } from '@/services/tender';

export default function TendersSection({
  openTenders,
}: {
  openTenders: OpenTender[];
}) {
  return (
    <section className="p-6 text-white">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Neue Ausschreibungen</h2>
      </div>

      {openTenders.length === 0 && (
        <div className="text-gray-300">
          Aktuell keine offenen Ausschreibungen.
        </div>
      )}

      {openTenders.length > 0 && (
        <div className="divide-y ">
          {openTenders.map((t) => (
            <Tender key={t.id} tender={t} />
          ))}
        </div>
      )}
    </section>
  );
}
