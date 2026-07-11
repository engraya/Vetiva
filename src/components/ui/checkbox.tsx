import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxLineProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
}

/** Native checkbox row with the prototype's `.checkline` look. */
export const CheckboxLine = forwardRef<HTMLInputElement, CheckboxLineProps>(
  ({ className, label, ...props }, ref) => (
    <label
      className={cn(
        'mt-3 flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-ink',
        className,
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        className="mt-0.5 size-[18px] shrink-0 cursor-pointer accent-olive-deep"
        {...props}
      />
      <span>{label}</span>
    </label>
  ),
);
CheckboxLine.displayName = 'CheckboxLine';
