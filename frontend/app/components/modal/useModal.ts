import { useCallback, useState } from 'react';

interface UseModalOptions {
  onClose?: () => void;
}

export function useModal({ onClose }: UseModalOptions = {}) {
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
