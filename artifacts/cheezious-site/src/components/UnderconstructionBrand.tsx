import { Pizza } from 'lucide-react';

export function UnderconstructionBrand({ className = '' }: { className?: string }) {
  return (
    <span className={`cx-wordmark-lockup ${className}`.trim()}>
      <span className="cx-wordmark-pizza" aria-hidden="true"><Pizza size={18} strokeWidth={2.5} /></span>
      <span className="cx-brand-name" aria-label="Underconstruction">
        <span className="cx-brand-under">Under</span>
        <span className="cx-brand-construction">construction</span>
      </span>
    </span>
  );
}
