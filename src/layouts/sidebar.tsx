import { NavLink, useLocation } from 'react-router';
import { ChartPie, House, LayoutGrid, TrendingUp, Wallet } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { useAuthStore } from '@/features/auth/store';
import { cn } from '@/lib/utils';

export interface NavItem {
  key: string;
  to: string;
  label: string;
  icon: typeof House;
}

export const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Home',
    items: [
      { key: 'home', to: '/dashboard', label: 'Home', icon: House },
      { key: 'wallet', to: '/wallet', label: 'Wallet', icon: Wallet },
      { key: 'offers', to: '/offers', label: 'Offers', icon: TrendingUp },
    ],
  },
  {
    label: 'Invest',
    items: [
      { key: 'products', to: '/products', label: 'Products', icon: LayoutGrid },
      { key: 'portfolio', to: '/portfolio', label: 'Portfolio', icon: ChartPie },
    ],
  },
];

export const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

/** Approved flow: flow pages highlight Offers; profile highlights Home. */
export function activeNavKey(pathname: string): string {
  if (pathname.startsWith('/wallet')) return 'wallet';
  if (
    pathname.startsWith('/offers') ||
    pathname.startsWith('/subscribe') ||
    pathname.startsWith('/top-up') ||
    pathname.startsWith('/subscription')
  ) {
    return 'offers';
  }
  if (pathname.startsWith('/products')) return 'products';
  if (pathname.startsWith('/portfolio')) return 'portfolio';
  return 'home';
}

export function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const { pathname } = useLocation();
  const active = activeNavKey(pathname);

  return (
    <div className="flex h-full flex-col px-3.5 pb-4 pt-[22px]">
      <div className="px-2.5 pb-1">
        <span className="text-lg font-extrabold tracking-[0.02em] text-olive-deep">Ⓥ VETIVA</span>
        <span className="block text-[8px] font-semibold tracking-[0.14em] text-muted">
          CAPITAL MANAGEMENT LIMITED
        </span>
      </div>

      <nav aria-label="Main" className="flex flex-1 flex-col">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="mx-2.5 mb-2 mt-[22px] text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              {group.label}
            </div>
            {group.items.map(({ key, to, label, icon: Icon }) => (
              <NavLink
                key={key}
                to={to}
                className={cn(
                  'mb-0.5 flex w-full items-center gap-2.5 rounded-input px-3 py-[11px] text-sm font-semibold transition-colors',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive',
                  active === key
                    ? 'bg-nav-active text-olive-deep shadow-[inset_3px_0_0_var(--color-olive-deep)]'
                    : 'text-ink hover:bg-[#F4F3EA]',
                )}
              >
                <Icon className="size-[18px]" aria-hidden />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {user && (
        <div className="mt-auto flex items-center gap-2.5 rounded-[14px] border border-line px-3 py-2.5">
          <Avatar name={user.name} className="size-[34px] text-[11px]" />
          <div className="min-w-0">
            <b className="block truncate text-xs font-bold tracking-[0.02em] text-ink">
              {user.name.toUpperCase()}
            </b>
            <span className="text-xs text-muted">My account</span>
          </div>
        </div>
      )}
    </div>
  );
}

/** Mobile replacement for the sidebar: fixed translucent bottom tab bar. */
export function BottomTabBar() {
  const { pathname } = useLocation();
  const active = activeNavKey(pathname);

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-line bg-white/95 px-1 pt-1.5 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'calc(6px + env(safe-area-inset-bottom))' }}
    >
      {NAV_ITEMS.map(({ key, to, label, icon: Icon }) => (
        <NavLink
          key={key}
          to={to}
          className={cn(
            'flex flex-1 flex-col items-center gap-0.5 rounded-[10px] px-2.5 py-1.5 text-[10px] font-semibold',
            active === key ? 'text-olive-deep' : 'text-muted',
          )}
        >
          <Icon className="size-5" aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
