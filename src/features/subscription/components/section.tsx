import { cn } from '@/lib/utils';

interface SectionProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** One-pager form section: icon + bold header + optional helper text. */
export function Section({ icon, title, description, children, className }: SectionProps) {
  return (
    <section className={cn('mt-6', className)}>
      <div className="flex items-center gap-2">
        <span className="text-olive-deep" aria-hidden>
          {icon}
        </span>
        <h2 className="text-[15px] font-bold text-ink">{title}</h2>
      </div>
      {description && <p className="mt-1 text-[13px] leading-relaxed text-muted">{description}</p>}
      {children}
    </section>
  );
}
