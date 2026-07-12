import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopNavProps {
  title?: string;
  onBack: () => void;
  className?: string;
}

/** The approved flow's plain back-arrow header for sub-screens. */
export function TopNav({ title, onBack, className }: TopNavProps) {
  return (
    <div className={cn('flex items-center gap-3.5 py-3', className)}>
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="rounded-md p-1 text-ink transition-colors hover:bg-olive-soft focus-visible:outline-2 focus-visible:outline-olive"
      >
        <ArrowLeft className="size-5" aria-hidden />
      </button>
      {title && <span className="text-sm font-bold text-ink">{title}</span>}
    </div>
  );
}
