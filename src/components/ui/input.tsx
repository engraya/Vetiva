import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        'w-full rounded-input border border-line bg-card px-4 py-[15px] text-[15px] text-ink',
        'shadow-[0_1px_2px_rgb(24_26_16/0.03)] placeholder:text-placeholder',
        'transition-[border-color,box-shadow] duration-150',
        'focus:outline-none focus:border-olive-deep focus:shadow-[inset_0_0_0_1px_var(--color-olive-deep)]',
        'disabled:bg-[#F1EFE3] disabled:text-[#A09D8B]',
        invalid && 'border-bad',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: React.ReactNode;
  error?: string | undefined;
  optional?: boolean;
  children: React.ReactNode | ((ids: { inputId: string; describedBy?: string }) => React.ReactNode);
  className?: string;
}

/** Label + control + hint/error wiring with correct aria associations. */
export function Field({ label, htmlFor, hint, error, optional, children, className }: FieldProps) {
  const autoId = useId();
  const inputId = htmlFor ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('mt-4', className)}>
      <label htmlFor={inputId} className="mb-2 block text-[13px] font-semibold text-ink">
        {label}
        {optional && <span className="ml-1.5 font-medium text-muted">(Optional)</span>}
      </label>
      {typeof children === 'function' ? children({ inputId, describedBy }) : children}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-bad" role="alert">
          {error}
        </p>
      )}
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs leading-relaxed text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
