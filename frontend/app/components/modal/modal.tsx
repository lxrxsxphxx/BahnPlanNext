import { useEffect } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {children}

        <button
          className="mt-6 w-full py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="mt-6 w-full py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Registrieren
        </button>
      </div>
    </div>
  );
}
