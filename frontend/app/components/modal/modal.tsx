import { useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Hilfsfunktion: Alle fokussierbaren Elemente im Modal finden
  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const selector = `
      button:not([disabled]),
      [href]:not([disabled]),
      input:not([disabled]),
      select:not([disabled]),
      textarea:not([disabled]),
      [tabindex]:not([tabindex="-1"])
    `;
    return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
  };
  // Keydown-Handler für Fokus-Management und Escape-Taste
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!modalRef.current) return;

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;
      //fokussierbare Elemente im Modal finden
      const focusableElements = getFocusableElements(modalRef.current);

      if (focusableElements.length === 0) return;

      e.preventDefault();

      if (focusableElements.length === 0) return;

      const activeElement = document.activeElement as HTMLElement;
      const currentIndex = focusableElements.indexOf(activeElement);

      let nextIndex: number;
      // Shift + Tab = rückwärts, Tab = vorwärts
      if (e.shiftKey) {
        nextIndex =
          currentIndex <= 0
            ? focusableElements.length - 1
            : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex < 0 ||
          currentIndex >= focusableElements.length - 1
            ? 0
            : currentIndex + 1;
      }

      focusableElements[nextIndex].focus();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;

    previousActiveElementRef.current = document.activeElement as HTMLElement;
    
    const overlayEl = overlayRef.current;
    const parent = overlayEl?.parentElement;
    const siblings = parent
      ? (Array.from(parent.children) as HTMLElement[])
      : (Array.from(document.body.children) as HTMLElement[]);
    const nonModalElements = siblings.filter((el) => el !== overlayEl);


    // Setze inert und aria-hidden auf non-modal elements
    nonModalElements.forEach((el) => {
      el.inert = true;
      el.setAttribute('aria-hidden', 'true');
    });

    // Event Listener auf document (nicht auf modal!)
    document.addEventListener('keydown', handleKeyDown, true);

    // Setze Focus auf erstes fokussierbares Element
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const firstFocusable = getFocusableElements(modalRef.current)[0];
        firstFocusable?.focus();
      }
    }, 50); // 50ms statt 0 für bessere Zuverlässigkeit

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown, true);

      nonModalElements.forEach((el) => {
        el.inert = false;
        el.removeAttribute('aria-hidden');
      });
    };
  }, [open, handleKeyDown]);

  // Focus-Restore wenn Modal geschlossen
  useEffect(() => {
    if (open) return;

    const timer = setTimeout(() => {
      previousActiveElementRef.current?.focus();
    }, 0);

    return () => clearTimeout(timer);
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role='presentation'
    >
      <div
        ref={modalRef}
        className=""
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}
