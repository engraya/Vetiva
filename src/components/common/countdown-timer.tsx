import { useCountdown } from '@/hooks/use-countdown';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  targetIso: string;
  label: string;
  className?: string;
}

/** Day/hr/min/sec unit cards, matching the prototype's `.cd` block. */
export function CountdownTimer({ targetIso, label, className }: CountdownTimerProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetIso);
  const units = [
    { value: String(days), unit: 'days' },
    { value: String(hours).padStart(2, '0'), unit: 'hrs' },
    { value: String(minutes).padStart(2, '0'), unit: 'min' },
    { value: String(seconds).padStart(2, '0'), unit: 'sec' },
  ];

  return (
    <div
      className={cn('mt-3 flex gap-2', className)}
      role="timer"
      aria-live="off"
      aria-label={`${label}: ${days} days, ${hours} hours, ${minutes} minutes`}
    >
      {units.map(({ value, unit }) => (
        <div
          key={unit}
          className="flex-1 rounded-input border border-line/70 bg-card py-2 text-center shadow-[0_1px_2px_rgb(24_26_16/0.04)]"
        >
          <span className="tabular block text-lg font-bold text-ink">{value}</span>
          <span className="text-[10px] uppercase tracking-[0.08em] text-muted">{unit}</span>
        </div>
      ))}
    </div>
  );
}
