import { Navigate, Outlet, useLocation } from 'react-router';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/common/logo';
import { DemoTag } from '@/components/common/demo-tag';
import { useAuthStore } from '@/features/auth/store';
import { OFFER_NAME, OFFER_TICKER, PRICE_PER_SHARE } from '@/constants/offer';
import { ngn } from '@/lib/money';

/**
 * Split-screen auth shell: brand narrative on the left (desktop),
 * form column on the right. Authenticated users are bounced to the app.
 */
export function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from ?? '/dashboard'} replace />;
  }

  return (
    <div className="flex min-h-dvh">
      {/* Brand panel */}
      <aside className="stage-gradient relative hidden w-[44%] max-w-2xl flex-col justify-between p-10 lg:flex xl:p-14">
        <Link to="/" aria-label="Vetiva home">
          <Logo light className="text-xl" />
        </Link>
        <div>
          <h1 className="max-w-md text-4xl font-bold leading-[1.1] tracking-[-0.025em] text-stage-ink">
            Invest in Nigeria's biggest IPOs
          </h1>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-stage-muted">
            Early access to public offers — verified identity, one-page subscription, and CSCS
            accounts created for you at no cost.
          </p>
          <div className="mt-8 rounded-card border border-stage-line bg-stage-card/80 p-5">
            <Badge variant="live" pulse>
              Live
            </Badge>
            <div className="mt-3 text-[15px] font-bold text-stage-ink">
              {OFFER_NAME} <span className="font-semibold text-stage-muted">({OFFER_TICKER})</span>
            </div>
            <div className="tabular mt-1 text-sm text-stage-muted">
              {ngn(PRICE_PER_SHARE)}/share <DemoTag />
            </div>
          </div>
        </div>
        <p className="text-xs text-stage-muted">
          © {new Date().getFullYear()} Vetiva Capital Management. Demo prototype — all figures are
          placeholders.
        </p>
      </aside>

      {/* Form column */}
      <main className="flex min-w-0 flex-1 flex-col bg-cream">
        <div className="flex items-center justify-between p-5 lg:justify-end">
          <Link to="/" aria-label="Vetiva home" className="lg:hidden">
            <Logo />
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-[460px] flex-1 flex-col justify-center px-5 pb-16">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
