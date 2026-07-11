import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineStep {
  title: string;
  description?: string;
  done: boolean;
}

/** Vertical progress timeline — the success page's "What happens next". */
export function Timeline({ steps, className }: { steps: TimelineStep[]; className?: string }) {
  return (
    <ol className={cn('mt-1.5', className)}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={step.title} className="relative flex gap-3.5 pb-5 last:pb-1">
            {!last && (
              <span
                aria-hidden
                className="absolute bottom-0 left-[11px] top-[26px] w-[1.5px] bg-[#DAD7C6]"
              />
            )}
            <span
              aria-hidden
              className={cn(
                'z-10 flex size-[23px] shrink-0 items-center justify-center rounded-full border-2',
                step.done ? 'border-good bg-good text-white' : 'border-[#C9C6AE] bg-card',
              )}
            >
              {step.done && <Check className="size-3" strokeWidth={3} />}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-bold text-ink">
                {step.title}
                <span
                  className={cn(
                    'ml-2 text-xs font-semibold',
                    step.done ? 'text-good' : 'text-[#A09D8B]',
                  )}
                >
                  {step.done ? 'Done' : 'Upcoming'}
                </span>
              </div>
              {step.description && (
                <p className="mt-0.5 text-[13px] leading-snug text-muted">{step.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
