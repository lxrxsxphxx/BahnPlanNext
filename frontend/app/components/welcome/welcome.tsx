import { useState } from "react";

type Slide = {
  image?: string;
  title: string;
  content: string[];
};

// Define the slides for the welcome modal
const slides: Slide[] = [
  {
    title: "Willkommen bei BahnPlan!",
    content: [
      "Treffe andere Spieler und hab Spaß in der Community.",
      "Plane Strecken, setze Züge ein und wachse Schritt für Schritt.",
    ],
    image: "/bahn.png",
  },
  {
    title: "Ausschreibungswettbewerbe",
    content: [
      "Bewirb dich auf spannende Strecken im Nah- und Güterverkehr.",
      "Sichere dir die besten Zeitslots im Fernverkehr.",
      "Optimiere deine Züge und verdiene Geld für dein Imperium.",
    ],
    image: "/plan.png",
  },
  {
    title: "Community & Austausch",
    content: [
      "Diskutiere, tausche Tipps und trickreiche Strategien.",
      "Arbeite zusammen oder tritt gegeneinander an.",
      "Zeige deine Erfolge und lass dich von anderen inspirieren!",
    ],
    image: "/community.png",
  },
];

type Props = {
  open: boolean; // whether the modal is open
  onClose: () => void; // callback to close the modal
};

export default function Welcome({ open, onClose }: Props) {
  const [current, setCurrent] = useState(0); // track the current slide index

  if (!open) return null; // do not render modal if not open

  // Go to the next slide (loop back to first slide if at the end)
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  // Go to the previous slide (loop to last slide if at the beginning)
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-1 backdrop-blur-sm">
      {/* Modal card */}
      <div
        className="relative w-[550px] h-[600px] flex flex-col rounded-lg shadow-lg overflow-hidden bg-white"
        style={{
          backgroundImage: "url('/bg_welcome.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        
        {/* Slide content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-opacity-25">
          {slides[current].image && (
            <img
              src={slides[current].image}
              alt={slides[current].title}
              className="mb-4 w-55 h-55 object-contain"
            />
          )}
          <h2 className="text-3xl font-bold mb-4 text-black">{slides[current].title}</h2>
          <ul className="space-y-2 text-[16px] text-gray-500">
            {slides[current].content.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>

        {/* Show final slide button to close modal */}
        {current === slides.length - 1 && (
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-white rounded text-[16px] text-black hover:bg-gray-400 hover:text-white"
          >
            Jetzt start dein eigenes Eisenbahn-Abenteuer!
          </button>
        )}

        {/* Navigation buttons container */}
        <div className="flex flex-col p-4 relative z-10">
          <div className="flex justify-between mb-3">
            {/* Previous slide button */}
            {current > 0 ? (
              <button
                onClick={prevSlide}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                PREV
              </button>
            ) : (
              <div className="w-[60px]" /> // keep space when button is hidden
            )}

            {/* Dot indicators */}
            <div className="flex justify-center mb-3 space-x-2">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`h-3 w-3 rounded-full ${
                    i === current ? "bg-white border border-gray-400" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>

            {/* Next slide button */}
            {current < slides.length - 1 ? (
              <button
                onClick={nextSlide}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                NEXT
              </button>
            ) : (
              <div className="w-[60px]" /> // keep space when button is hidden
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
