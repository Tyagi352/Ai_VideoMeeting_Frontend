import { useEffect } from 'react';

export default function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;

  return (
    <div className="nc-card fixed bottom-6 right-6 z-50 px-5 py-3 text-sm">
      {message}
    </div>
  );
}
