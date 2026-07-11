import { cn } from '@/lib/utils';

interface SectionProps {
  step?: number;
  icon: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Numbered form section card for the subscribe one-pager. */
export function Section({ step, icon, title, description, children, className }: SectionProps) {
  return (
    <section
      className={cn('rounded-card border border-line/70 bg-card p-4 shadow-card md:p-6', className)}
    >
      <div className="flex items-center gap-2.5">
        {step !== undefined && (
          <span
            aria-hidden
            className="flex size-6 shrink-0 items-center justify-center rounded-full bg-olive-soft text-[11px] font-extrabold text-olive-deep"
          >
            {step}
          </span>
        )}
        <span className="text-olive-deep" aria-hidden>
          {icon}
        </span>
        <h2 className="text-[15px] font-bold text-ink">{title}</h2>
      </div>
      {description && (
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{description}</p>
      )}
      {children}
    </section>
  );
}
