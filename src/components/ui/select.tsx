import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

/** Styled native select — keyboard/screen-reader behaviour for free. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          'w-full appearance-none rounded-input border border-line bg-card px-4 py-[15px] pr-10 text-[15px] text-ink',
          'shadow-[0_1px_2px_rgb(24_26_16/0.03)]',
          'transition-[border-color,box-shadow] duration-150',
          'focus:outline-none focus:border-olive-deep focus:shadow-[inset_0_0_0_1px_var(--color-olive-deep)]',
          invalid && 'border-bad',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
        aria-hidden
      />
    </div>
  ),
);
Select.displayName = 'Select';
