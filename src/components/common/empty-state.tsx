import { cn } from '@/lib/utils';

interface EmptyStateProps {
  /** Emoji glyph, per the approved flow's empty boxes */
  icon: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/** The approved flow's `emptybox`: centered, muted, big emoji. */
export function EmptyState({ icon, children, action, className }: EmptyStateProps) {
  return (
    <div className={cn('px-5 py-[60px] text-center text-sm leading-relaxed text-muted', className)}>
      <div className="mb-2.5 text-[2.2rem]" aria-hidden>
        {icon}
      </div>
      {children}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
