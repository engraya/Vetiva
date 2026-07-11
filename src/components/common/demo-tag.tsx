import { cn } from '@/lib/utils';

/** Marks placeholder figures, matching the prototype's dashed [DEMO] chip. */
export function DemoTag({ label = 'DEMO', className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-block rounded-md border border-dashed border-[#C9C6AE] bg-[#EFEDDF] px-1.5 py-px align-middle text-[10px] font-bold tracking-[0.08em] text-[#8A8768]',
        className,
      )}
    >
      {label}
    </span>
  );
}
