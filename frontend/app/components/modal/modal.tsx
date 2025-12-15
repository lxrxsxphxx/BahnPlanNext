import { type ReactNode, useEffect } from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="animate-scaleIn w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}

        <button
          className="mt-6 w-full rounded-xl bg-blue-600 py-2 text-white transition hover:bg-blue-700"
          onClick={onClose}
        >
          Close
        </button>
        <button className="mt-6 w-full rounded-xl bg-blue-600 py-2 text-white transition hover:bg-blue-700">
          Registrieren
        </button>
      </div>
    </div>
  );
}
