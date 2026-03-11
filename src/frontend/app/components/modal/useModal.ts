import { useState, useCallback } from "react";

interface UseModalOptions {
  onClose?: () => void;
}

/**
 * **useModal (Custom Hook)**
 * * Verwaltet den Sichtbarkeitsstatus eines Modals und trennt die State-Logik von der UI.
 *
 * ### Funktionalitäten
 * - **Zustandssteuerung**: Bietet `open` (boolean) sowie Funktionen zum Öffnen/Schließen.
 * - **Memoized Handler**: Alle Funktionen sind via `useCallback` optimiert (verhindert unnötige Re-Renders).
 * - **Lifecycle-Callback**: Unterstützt eine optionale `onClose`-Logik für Seiteneffekte (z. B. Formular-Resets).
 *
 * ### API (Return-Werte)
 * - `open`: Aktueller Status (true/false).
 * - `show`: Setzt `open` auf true.
 * - `hide`: Setzt `open` auf false.
 * - `close`: Schließt das Modal **und** führt den optionalen `onClose`-Callback aus.
 *
 * @param options.onClose - Optionaler Callback bei Schließvorgang.
 * @module Hooks/UI
 * @example
 * ```tsx
 * const { open, show, close } = useModal({ onClose: () => resetForm() });
 * <Modal open={open} onClose={close} />
 * ```
 */

export function useModal(options: UseModalOptions = {}) {
  const { onClose } = options;
  const [open, setOpen] = useState(false);

  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  // Combined close handler: hides modal + calls optional callback
  const close = useCallback(() => {
    setOpen(false);
    if (onClose) onClose();
  }, [onClose]);

  return { open, show, hide, close };
}
