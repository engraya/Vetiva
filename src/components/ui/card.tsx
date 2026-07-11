import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-card border border-line/70 bg-card p-4 shadow-card md:p-6', className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export function SummaryRow({
  label,
  value,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-between gap-4 py-1.5 text-sm', className)}>
      <span className="text-muted">{label}</span>
      <span className="tabular text-right font-semibold text-ink">{value}</span>
    </div>
  );
}
