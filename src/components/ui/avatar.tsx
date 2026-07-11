import { cn, initials } from '@/lib/utils';

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-full bg-olive-soft text-xs font-extrabold text-olive-deep',
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
