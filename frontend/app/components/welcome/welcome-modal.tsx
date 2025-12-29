import { useState } from 'react';

/**
 * Typdefinition für jeden Slide
 */
type Slide = {
  image?: string; // optionales Bild
  title: string; // Titel des Slides
  content: string[]; // Inhalt des Slides
};

/**
 * Array von Slides für das Welcome Modal
 */
const slides: Slide[] = [
  {
    title: 'Willkommen bei BahnPlan!',
    content: [
      'Treffe andere Spieler und hab Spaß in der Community.',
      'Plane Strecken, setze Züge ein und wachse Schritt für Schritt.',
    ],
    image: '/bahn.png',
  },
  {
    title: 'Ausschreibungswettbewerbe',
    content: [
      'Bewirb dich auf spannende Strecken im Nah- und Güterverkehr.',
      'Sichere dir die besten Zeitslots im Fernverkehr.',
      'Optimiere deine Züge und verdiene Geld für dein Imperium.',
    ],
    image: '/plan.png',
  },
  {
    title: 'Community & Austausch',
    content: [
      'Diskutiere, tausche Tipps und trickreiche Strategien.',
      'Arbeite zusammen oder tritt gegeneinander an.',
      'Zeige deine Erfolge und lass dich von anderen inspirieren!',
    ],
    image: '/community.png',
  },
];

/**
 * Props für das Welcome Modal
 */
export type Props = {
  /** Steuert, ob das Modal sichtbar ist */
  open: boolean;
  /** Funktion, die aufgerufen wird, wenn das Modal geschlossen wird */
  onClose: () => void;
};

/**
 * WelcomeModal-Komponente
 *
 * Zeigt eine Reihe von Slides für neue Nutzer an.
 *
 * @param open - Modal sichtbar oder nicht
 * @param onClose - Callback, wenn Modal geschlossen wird
 */
export function WelcomeModal({ open, onClose }: Props) {
  const [current, setCurrent] = useState(0); // aktueller Slide-Index

  if (!open) return null;

  /** Funktionen zum Wechseln der Slides */
  const nextSlide = () => setCurrent((p) => (p + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((p) => (p - 1 + slides.length) % slides.length);

  return (
    <div className="bg-opacity-1 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative flex h-[600px] w-[550px] flex-col overflow-hidden rounded-xl bg-gradient-to-b from-gray-100 to-white shadow-lg">
        {/* Slide Inhalt */}
        <div className="bg-opacity-50 flex flex-1 flex-col items-center justify-center p-8 text-center">
          {/* Wenn das aktuelle Slide ein Bild hat, anzeigen */}
          {slides[current].image && (
            <img
              src={slides[current].image}
              alt={slides[current].title}
              className="mb-4 h-55 w-55 object-contain"
            />
          )}

          {/* Titel des aktuellen Slides */}
          <h2 className="mb-4 text-3xl font-bold text-black">
            {slides[current].title}
          </h2>

          {/* Liste mit Inhalten/Informationen des Slides */}
          <ul className="space-y-2 text-[16px] text-gray-700">
            {slides[current].content.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>

        {/* Button nur beim letzten Slide */}
        {current === slides.length - 1 && (
          <button
            onClick={onClose}
            className="mx-auto block transform rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            Starte jetzt dein eigenes Eisenbahn-Abenteuer!
          </button>
        )}

        {/* Navigation und Pagination */}
        <div className="relative z-10 flex flex-col p-4">
          {/* Buttons & Dots */}
          <div className="mb-3 flex justify-between">
            {/* Previous Button */}
            {current > 0 ? (
              <button
                onClick={prevSlide}
                className="rounded border border-gray-200 px-3 py-1 text-sm text-black hover:bg-gray-200"
              >
                ZURÜCK
              </button>
            ) : (
              <div className="w-[60px]" />
            )}

            {/* Pagination Dots */}
            <div className="mb-3 flex justify-center space-x-2">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`h-3 w-3 rounded-full ${i === current ? 'border border-gray-400 bg-white' : 'bg-gray-400'} `}
                />
              ))}
            </div>

            {/* Next Button */}
            {current < slides.length - 1 ? (
              <button
                onClick={nextSlide}
                className="rounded border border-gray-200 px-3 py-1 text-sm text-black hover:bg-gray-200"
              >
                WEITER
              </button>
            ) : (
              <div className="w-[60px]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
