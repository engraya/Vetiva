import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  steps: readonly string[];
  current: number;
  className?: string;
}

/** Horizontal wizard progress for the registration flow. */
export function StepIndicator({ steps, current, className }: StepIndicatorProps) {
  return (
    <ol className={cn('flex items-center gap-2', className)} aria-label="Registration progress">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={step}
            className="flex flex-1 items-center gap-2"
            aria-current={active ? 'step' : undefined}
          >
            <span
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                done && 'bg-good text-white',
                active && 'bg-olive-deep text-white',
                !done && !active && 'bg-olive-soft text-muted',
              )}
              aria-hidden
            >
              {done ? <Check className="size-3" strokeWidth={3} /> : i + 1}
            </span>
            <span
              className={cn(
                'hidden text-xs font-semibold sm:block',
                active ? 'text-ink' : 'text-muted',
              )}
            >
              {step}
            </span>
            {i < steps.length - 1 && <span className="h-px flex-1 bg-line" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
