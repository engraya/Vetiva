import { cn } from '@/lib/utils';

/** Vetiva wordmark, matching the prototype's "Ⓥ vetiva" treatment. */
export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-baseline gap-1 text-[17px] font-extrabold tracking-tight',
        light ? 'text-stage-ink' : 'text-olive-deep',
        className,
      )}
    >
      <span aria-hidden>Ⓥ</span>
      <span>vetiva</span>
    </span>
  );
}
