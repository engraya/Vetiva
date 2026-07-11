import { NavLink } from 'react-router';
import { LayoutDashboard, LifeBuoy, TrendingUp, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '@/components/common/logo';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/subscribe', label: 'Subscribe', icon: TrendingUp },
  { to: '/profile', label: 'Profile', icon: UserRound },
] as const;

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col p-5">
      <div className="px-2 py-1.5">
        <Logo light className="text-lg" />
      </div>

      <nav aria-label="Main" className="mt-8 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-input px-3.5 py-3 text-sm font-semibold transition-colors',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stage-accent',
                isActive
                  ? 'bg-stage-card text-stage-ink shadow-[inset_0_0_0_1px_var(--color-stage-line)]'
                  : 'text-stage-muted hover:bg-stage-card/60 hover:text-stage-ink',
              )
            }
          >
            <Icon className="size-[18px]" aria-hidden />
            {label}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={() => toast('Support is not part of this demo')}
          className="mt-auto flex items-center gap-3 rounded-input px-3.5 py-3 text-sm font-semibold text-stage-muted transition-colors hover:bg-stage-card/60 hover:text-stage-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stage-accent"
        >
          <LifeBuoy className="size-[18px]" aria-hidden />
          Support
        </button>
      </nav>

      <p className="mt-6 border-t border-stage-line px-2 pt-4 text-[11px] leading-relaxed text-stage-muted">
        Demo prototype. All figures, fees and rates are placeholders.
      </p>
    </div>
  );
}
