import { useId } from 'react';
import { cn } from '@/lib/utils';

export interface SegmentOption<T extends string> {
  value: T;
  label: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  'aria-label': string;
  className?: string;
}

/**
 * The prototype's `.seg` control as an accessible radiogroup
 * (arrow keys via native radio semantics, visually hidden inputs).
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  const name = useId();
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('mt-2.5 flex gap-1 rounded-[20px] bg-olive-soft p-1', className)}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <label
            key={opt.value}
            className={cn(
              'flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-btn px-3 py-3 text-sm font-bold',
              'transition-[background-color,color,box-shadow,transform] duration-200 motion-safe:active:scale-[0.96]',
              'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-olive',
              active
                ? 'bg-card text-ink shadow-[0_2px_8px_rgb(24_26_16/0.1),0_1px_2px_rgb(24_26_16/0.05)]'
                : 'text-muted hover:text-ink',
            )}
          >
            <input
              type="radio"
              name={name}
              checked={active}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            {opt.label}
          </label>
        );
      })}
    </div>
  );
}
