import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 font-bold tracking-[-0.01em]',
    'cursor-pointer select-none whitespace-nowrap',
    'transition-[transform,box-shadow,filter,background-color,border-color] duration-150 ease-(--ease-spring)',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
    'disabled:cursor-not-allowed disabled:bg-olive-pale disabled:text-olive-pale-text disabled:shadow-none disabled:bg-none',
    'motion-safe:active:scale-[0.97]',
  ],
  {
    variants: {
      variant: {
        primary:
          'brand-gradient text-[#F7F8EF] shadow-btn hover:brightness-104 active:shadow-btn-press',
        ghost:
          'bg-card text-olive-deep border-[1.5px] border-line shadow-[0_1px_2px_rgb(24_26_16/0.03)] hover:bg-olive-soft hover:border-olive disabled:border-transparent',
        soft: 'bg-olive-soft text-olive-deep hover:bg-olive-pale',
        link: 'bg-transparent text-olive-deep font-semibold hover:underline underline-offset-2 focus-visible:outline-olive',
        dark: 'bg-stage text-stage-ink border border-stage-line hover:bg-stage-card',
        inverse: 'bg-white text-olive-deep hover:bg-white/90',
      },
      size: {
        lg: 'h-[54px] px-5 text-[15px] rounded-btn w-full',
        md: 'h-11 px-5 text-sm rounded-btn',
        sm: 'h-9 px-4 text-[13px] rounded-[10px]',
        pill: 'h-8 px-4 text-xs rounded-full',
        bare: 'h-auto p-1 text-sm rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, children, disabled, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled ?? loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
