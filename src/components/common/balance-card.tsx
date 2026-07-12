import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BalanceCardProps {
  label: string;
  value: string;
  children?: React.ReactNode;
  className?: string;
}

/** Approved dashboard balance card: bordered, flat, NGN chip, big tabular value. */
export function BalanceCard({ label, value, children, className }: BalanceCardProps) {
  return (
    <div
      className={cn(
        'flex min-h-[150px] flex-col rounded-btn border border-line bg-white px-5 py-[18px]',
        className,
      )}
    >
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
        <span className="flex items-center gap-1.5">
          {label} <Eye className="size-3.5" aria-hidden />
        </span>
        <span className="rounded-[9px] border border-line px-2 py-[3px] text-[11px] font-bold text-ink">
          🇳🇬 NGN
        </span>
      </div>
      <div className="tabular mt-2.5 text-[30px] font-extrabold leading-none tracking-tight text-ink">
        {value}
      </div>
      {children}
    </div>
  );
}
