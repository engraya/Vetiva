import { Check, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OkBand({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'mt-2.5 flex items-center gap-2.5 rounded-input border border-good-line bg-good-soft px-3.5 py-3 text-sm font-bold text-good-deep',
        className,
      )}
    >
      <span
        aria-hidden
        className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-good text-white"
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function WarnBand({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mt-3 flex gap-2.5 rounded-input border border-amber-line bg-amber-soft px-3.5 py-3 text-[13px] leading-relaxed text-amber-deep',
        className,
      )}
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function DangerBox({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mt-3.5 rounded-[14px] border-[1.5px] border-bad-line bg-bad-soft px-4 py-3.5',
        className,
      )}
    >
      <div className="flex items-center gap-2 text-sm font-extrabold text-bad">
        <TriangleAlert className="size-4 shrink-0" aria-hidden />
        {title}
      </div>
      <div className="mt-1.5 text-[13px] leading-relaxed text-bad-deep">{children}</div>
    </div>
  );
}
