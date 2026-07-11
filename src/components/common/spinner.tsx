import { cn } from '@/lib/utils';

export function Spinner({ className, label = 'Loading' }: { className?: string; label?: string }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block size-13 rounded-full border-4 border-olive-soft border-t-olive motion-safe:animate-spin-slow motion-reduce:animate-spin motion-reduce:[animation-duration:2.5s]',
        className,
      )}
    />
  );
}

export function MiniSpinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block size-[18px] rounded-full border-[3px] border-olive-soft border-t-olive align-middle motion-safe:animate-spin-slow motion-reduce:animate-spin motion-reduce:[animation-duration:2.5s]',
        className,
      )}
    />
  );
}
