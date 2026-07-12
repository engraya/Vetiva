import { Link } from 'react-router';
import { Building2, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/common/segmented-control';
import { WarnBand } from '@/components/common/status-band';
import { DemoTag } from '@/components/common/demo-tag';
import { PageTransition } from '@/components/common/page-transition';
import { useRegisterStore } from '@/features/auth/register-store';
import { OFFER_NAME } from '@/constants/offer';

/** Entry screen ("Get started") inside the auth shell, per the approved flow. */
export function GetStartedPage() {
  const accountType = useRegisterStore((s) => s.accountType);
  const setAccountType = useRegisterStore((s) => s.setAccountType);

  return (
    <PageTransition>
      <h1 className="mt-4 text-[26px] font-bold leading-tight tracking-[-0.025em] text-ink">
        Get started
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">
        Subscribe to the {OFFER_NAME} IPO.
      </p>

      <div className="mt-5">
        <h2 className="text-[15px] font-bold text-ink">I'm subscribing as</h2>
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

      <div className="mt-10 space-y-2.5">
        <Button asChild size="lg">
          <Link to="/auth/register">Create new account</Link>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link to="/auth/login">I already have an account</Link>
        </Button>
      </div>
    </PageTransition>
  );
}
