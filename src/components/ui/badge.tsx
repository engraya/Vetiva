import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.05em]',
  {
    variants: {
      variant: {
        live: 'bg-good-soft text-good-deep',
        soon: 'bg-amber-soft text-amber-deep',
        verified: 'bg-good-soft text-good-deep',
        neutral: 'bg-olive-soft text-olive-deep',
        guardian: 'bg-good-soft text-good-deep',
        cheapest: 'bg-good-soft text-good-deep px-2 py-0.5 text-[10px] tracking-[0.06em]',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Renders the pulsing live dot */
  pulse?: boolean;
}

export function Badge({ className, variant, pulse, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {pulse && (
        <span className="relative flex size-1.5" aria-hidden>
          <span className="absolute inset-0 rounded-full bg-good opacity-35 motion-safe:animate-live-pulse" />
          <span className="relative size-1.5 rounded-full bg-good" />
        </span>
      )}
      {children}
    </span>
  );
}
