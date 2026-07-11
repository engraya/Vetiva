import { Link, Navigate } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { Building2, TrendingUp, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/logo';
import { SegmentedControl } from '@/components/common/segmented-control';
import { WarnBand } from '@/components/common/status-band';
import { DemoTag } from '@/components/common/demo-tag';
import { useAuthStore } from '@/features/auth/store';
import { useRegisterStore } from '@/features/auth/register-store';
import { OFFER_NAME } from '@/constants/offer';

export function LandingPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accountType = useRegisterStore((s) => s.accountType);
  const setAccountType = useRegisterStore((s) => s.setAccountType);
  const reduced = useReducedMotion();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="stage-gradient flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <Logo light className="text-lg" />
        <Button asChild variant="dark" size="sm">
          <Link to="/auth/login">Log in</Link>
        </Button>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 pb-16">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.7, 0.3, 1] }}
          className="w-full max-w-[520px]"
        >
          <div className="rounded-lg bg-cream p-6 shadow-overlay md:p-10">
            {/* Hero illustration */}
            <div className="flex justify-center">
              <div
                aria-hidden
                className="flex size-28 items-center justify-center rounded-full shadow-pos"
                style={{
                  background:
                    'radial-gradient(circle at 32% 28%, #8D9760, var(--color-olive) 55%, var(--color-olive-deep) 100%)',
                }}
              >
                <TrendingUp className="size-11 text-[#F7F8EF]" aria-hidden />
              </div>
            </div>

            <h1 className="mt-7 text-center text-[28px] font-bold leading-tight tracking-[-0.025em] text-ink md:text-[32px]">
              Invest in Nigeria's biggest IPOs
            </h1>
            <p className="mt-2.5 text-center text-[15px] leading-relaxed text-muted">
              Early access to offers like the {OFFER_NAME} IPO.
            </p>

            <div className="mt-7">
              <h2 className="text-sm font-bold text-ink">I'm subscribing as</h2>
              <SegmentedControl
                aria-label="Account type"
                value={accountType}
                onChange={setAccountType}
                options={[
                  {
                    value: 'individual',
                    label: (
                      <>
                        <UserRound className="size-4" aria-hidden /> Individual
                      </>
                    ),
                  },
                  {
                    value: 'corporate',
                    label: (
                      <>
                        <Building2 className="size-4" aria-hidden /> Corporate
                      </>
                    ),
                  },
                ]}
              />
              {accountType === 'corporate' && (
                <WarnBand>
                  Corporate onboarding uses CAC/RC verification instead of BVN.{' '}
                  <DemoTag label="FLOW TO BE SPECIFIED — proceeds as Individual in this demo" />
                </WarnBand>
              )}
            </div>

            <div className="mt-8 space-y-2.5">
              <Button asChild size="lg">
                <Link to="/auth/register">Create new account</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link to="/auth/login">I already have an account</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
