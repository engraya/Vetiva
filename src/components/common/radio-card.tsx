import { cn } from '@/lib/utils';

interface RadioCardProps {
  name: string;
  checked: boolean;
  onSelect: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

/**
 * Selectable card row with a real radio input (visually custom):
 * used for payment methods and the "I don't have one" CSCS option.
 */
export function RadioCard({
  name,
  checked,
  onSelect,
  children,
  disabled,
  className,
}: RadioCardProps) {
  return (
    <label
      className={cn(
        'mt-2.5 flex w-full cursor-pointer items-center gap-3 rounded-card border-[1.5px] bg-card px-4 py-3.5 text-left',
        'transition-[box-shadow,transform,border-color,background-color] duration-150',
        'hover:shadow-e1 motion-safe:active:scale-[0.98]',
        'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-olive',
        checked ? 'border-olive bg-[#FCFBF4]' : 'border-line',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        disabled={disabled}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          'relative size-5 shrink-0 rounded-full border-2',
          checked ? 'border-olive' : 'border-[#C9C6AE]',
        )}
      >
        {checked && <span className="absolute inset-[3px] rounded-full bg-olive" />}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </label>
  );
}
