import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { qtyStep, roundQty } from '@/lib/shares';
import { cn } from '@/lib/utils';

interface QuantityStepperProps {
  value: number;
  floor: number;
  onChange: (value: number) => void;
  className?: string;
}

/**
 * Share stepper with the offer's rounding rules: ± moves by the current
 * step; free-typed values snap to the nearest valid step on blur/enter.
 */
export function QuantityStepper({ value, floor, onChange, className }: QuantityStepperProps) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  function commitDraft() {
    const parsed = parseInt(draft.replace(/\D/g, ''), 10);
    onChange(roundQty(Number.isNaN(parsed) ? floor : parsed, floor));
  }

  function nudge(direction: 1 | -1) {
    onChange(roundQty(value + direction * qtyStep(value), floor));
  }

  const stepBtn =
    'flex size-12 shrink-0 items-center justify-center rounded-full border border-line bg-card text-ink shadow-[0_1px_2px_rgb(24_26_16/0.05)] transition-transform duration-150 motion-safe:active:scale-90 hover:border-olive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive';

  return (
    <div className={cn('mt-3 flex items-center gap-3', className)}>
      <button type="button" onClick={() => nudge(-1)} aria-label="Fewer shares" className={stepBtn}>
        <Minus className="size-5" aria-hidden />
      </button>
      <input
        inputMode="numeric"
        value={draft}
        aria-label="Number of shares"
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))}
        onBlur={commitDraft}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commitDraft();
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            nudge(1);
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            nudge(-1);
          }
        }}
        className={cn(
          'tabular h-14 w-full min-w-0 flex-1 rounded-[14px] border border-line bg-card text-center text-xl font-bold text-ink',
          'transition-[border-color] duration-150 focus:border-olive-deep focus:outline-none',
        )}
      />
      <button type="button" onClick={() => nudge(1)} aria-label="More shares" className={stepBtn}>
        <Plus className="size-5" aria-hidden />
      </button>
    </div>
  );
}

interface QuickPicksProps {
  picks: readonly number[];
  value: number;
  onPick: (value: number) => void;
}

export function QuickPicks({ picks, value, onPick }: QuickPicksProps) {
  return (
    <div className="mt-3 grid grid-cols-4 gap-2">
      {picks.map((pick) => {
        const active = pick === value;
        return (
          <button
            key={pick}
            type="button"
            onClick={() => onPick(pick)}
            aria-pressed={active}
            className={cn(
              'tabular rounded-input border py-2.5 text-sm font-semibold transition-[transform,background-color,border-color] duration-150 motion-safe:active:scale-[0.94]',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive',
              active
                ? 'border-olive bg-olive text-ink-btn'
                : 'border-line bg-card text-ink hover:border-olive',
            )}
          >
            {active ? '✓ ' : ''}
            {pick.toLocaleString()}
          </button>
        );
      })}
    </div>
  );
}
