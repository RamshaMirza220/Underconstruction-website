import { useEffect } from 'react';
import { Check, X } from 'lucide-react';

export type AuthToastTone = 'error' | 'success';

export function AuthToast({
  message,
  tone,
  onDismiss,
}: {
  message: string;
  tone: AuthToastTone;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDismiss, 3400);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;
  return (
    <div className={`cx-auth-toast is-${tone}`} role="status" aria-live="polite" data-testid="toast-auth">
      <span className="cx-auth-toast-icon">{tone === 'success' ? <Check size={17} /> : <span aria-hidden="true">!</span>}</span>
      <span>{message}</span>
      <button type="button" aria-label="Dismiss notification" onClick={onDismiss} data-testid="button-dismiss-auth-toast"><X size={16} /></button>
    </div>
  );
}
