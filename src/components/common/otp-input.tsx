import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * Segmented one-time-code input: auto-advance, backspace navigation,
 * and paste distribution across boxes.
 */
export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled,
  className,
  'aria-label': ariaLabel = 'Verification code',
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  function setDigit(index: number, digit: string) {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join('').slice(0, length));
  }

  function handleChange(index: number, raw: string) {
    const cleaned = raw.replace(/\D/g, '');
    if (!cleaned) {
      setDigit(index, '');
      return;
    }
    if (cleaned.length > 1) {
      // Paste or autocomplete: distribute from this box forward
      const merged = (value.slice(0, index) + cleaned).slice(0, length);
      onChange(merged);
      refs.current[Math.min(merged.length, length - 1)]?.focus();
      return;
    }
    setDigit(index, cleaned);
    if (index < length - 1) refs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < length - 1) refs.current[index + 1]?.focus();
  }

  return (
    <div className={cn('flex gap-2', className)} role="group" aria-label={ariaLabel}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={length}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          className={cn(
            'h-13 w-full min-w-0 rounded-input border border-line bg-card text-center text-lg font-bold text-ink',
            'shadow-[0_1px_2px_rgb(24_26_16/0.03)] transition-[border-color,box-shadow] duration-150',
            'focus:outline-none focus:border-olive-deep focus:shadow-[inset_0_0_0_1px_var(--color-olive-deep)]',
            'disabled:bg-[#F1EFE3] disabled:text-[#A09D8B]',
          )}
        />
      ))}
    </div>
  );
}
