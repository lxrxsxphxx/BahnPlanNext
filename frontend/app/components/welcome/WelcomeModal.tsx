import { useState } from "react";

// Typdefinition für jeden Slide
type Slide = {
  image?: string;        // optionales Bild
  title: string;         // Titel des Slides
  content: string[];     // Inhalt des Slides
};

// Array von Slides für das Welcome Modal
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

// Props für das Welcome Modal
export type Props = {
  open: boolean;       // Steuerung, ob Modal sichtbar ist
  onClose: () => void; // Funktion zum Schließen des Modals
};

// WelcomeModal-Komponente
export default function WelcomeModal({ open, onClose }: Props) {
  const [current, setCurrent] = useState(0); // aktueller Slide-Index

  // Wenn open false ist, nichts rendern
  if (!open) return null;

  // Funktionen zum Wechseln der Slides
  const nextSlide = () => setCurrent((p) => (p + 1) % slides.length);
  const prevSlide = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);

  return (
    <div
      className="
        fixed               /* Positioniert das Modal fixiert im Viewport */
        inset-0             /* Oben, rechts, unten, links auf 0 */
        flex                /* Flexbox aktivieren */
        items-center        /* Vertikal zentrieren */
        justify-center      /* Horizontal zentrieren */
        z-50                /* Hohe z-Index für Modal */
        bg-opacity-1        /* Hintergrund-Deckkraft (hier 1 = voll sichtbar) */
        backdrop-blur-sm    /* Leichter Blur-Effekt auf den Hintergrund */
      "
    >
      {/* Modal Container */}
      <div
        className="
          relative          /* Relativ positioniert für Kinder-Elemente */
          w-[550px]         /* Breite des Modals */
          h-[600px]         /* Höhe des Modals */
          flex
          flex-col
          rounded-lg        /* Abgerundete Ecken */
          shadow-lg         /* Schattenwurf */
          overflow-hidden   /* Inhalt, der überläuft, wird abgeschnitten */
          bg-radial-[at_50%_40%] from-white/100 via-white/20 to-gray-100 to-70%
        "
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Slide Inhalt */}
        <div
          className="
            flex-1
            flex
            flex-col           /* Richtet die Kinder vertikal an */
            items-center       /* Zentriert Kinder horizontal */
            justify-center     /* Zentriert Kinder vertikal */
            text-center        /* Text zentriert */
            p-6                /* Innenabstand rundum */
            bg-opacity-25      /* Leichte Transparenz für den Hintergrund */
          "
        >
          {/* Wenn das aktuelle Slide ein Bild hat, anzeigen */}
          {slides[current].image && (
            <img
              src={slides[current].image}
              alt={slides[current].title}
              className="
                mb-4              /* Abstand nach unten */
                w-55              /* Breite des Bildes */
                h-55              /* Höhe des Bildes */
                object-contain    /* Bild vollständig sichtbar im Container */
              "
            />
          )}

          {/* Titel des aktuellen Slides */}
          <h2
            className="
              text-3xl         /* Große Schrift */
              font-bold        /* Fett */
              mb-4             /* Abstand nach unten */
              text-black       /* Schwarze Schriftfarbe */
            "
          >
            {slides[current].title}
          </h2>

          {/* Liste mit Inhalten/Informationen des Slides */}
          <ul
            className="
              space-y-2         /* Abstand zwischen den Listenelementen */
              text-[16px]       /* Schriftgröße */
              text-gray-500     /* Graue Schriftfarbe */
            "
          >
            {slides[current].content.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>

        {/* Button nur beim letzten Slide */}
        {current === slides.length - 1 && (
          <button
            onClick={onClose}
            className="
              px-6 py-3                  /* Innenabstand: 6px horizontal, 3px vertikal */
              bg-gray-800                /* Hintergrundfarbe dunkelgrau */
              text-white                 /* Textfarbe weiß */
              font-semibold              /* Schrift leicht fett */
              rounded-lg                 /* Abgerundete Ecken */
              shadow-md                  /* Standard Schatten */
              hover:shadow-xl            /* Schatten beim Hover vergrößert */
              transform hover:-translate-y-1 /* Leichte Bewegung beim Hover */
              transition-all duration-200     /* Animation für alle Veränderungen über 200ms */
              mx-auto block              /* Zentriert den Button horizontal */
            "
          >
            Jetzt start dein eigenes Eisenbahn-Abenteuer!
          </button>
        )}

        {/* Navigation und Pagination */}
        <div
          className="
            flex
            flex-col
            p-4                  /* Innenabstand rundum */
            relative             /* Relative Position für z-index */
            z-10                 /* Z-Index um über Hintergrund zu liegen */
          "
        >
          {/* Buttons & Dots */}
          <div
            className="
              flex
              justify-between
              mb-3                 /* Abstand nach unten */
            "
          >
            {/* Previous Button */}
            {current > 0 ? (
              <button
                onClick={prevSlide}
                className="
                  px-3 py-1          /* Padding */
                  bg-gray-200        /* Hintergrund hellgrau */
                  rounded            /* Abgerundete Ecken */
                  hover:bg-gray-300  /* Hover-Effekt */
                  text-sm            /* Kleine Schrift */
                "
              >
                PREV
              </button>
            ) : (
              <div className="w-[60px]" />
            )}

            {/* Pagination Dots */}
            <div className="flex justify-center mb-3 space-x-2">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`
                    h-3 w-3
                    rounded-full
                    ${i === current ? "bg-white border border-gray-400" : "bg-gray-400"}
                  `}
                />
              ))}
            </div>
              
            {/* Next Button */}
            {current < slides.length - 1 ? (
              <button
                onClick={nextSlide}
                className="
                  px-3 py-1
                  bg-gray-200
                  rounded
                  hover:bg-gray-300
                  text-sm
                "
              >
                NEXT
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
