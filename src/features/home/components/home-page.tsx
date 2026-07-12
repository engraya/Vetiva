import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ArrowUpRight, Plus, Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BalanceCard } from '@/components/common/balance-card';
import { DemoTag } from '@/components/common/demo-tag';
import { PageTransition } from '@/components/common/page-transition';
import { useOffer } from '@/features/offer/api';
import { useSubscriptions } from '@/features/subscription/api';
import { useMe } from '@/features/profile/api';
import { OFFER_NAME } from '@/constants/offer';
import { ngn } from '@/lib/money';
import { cn } from '@/lib/utils';

function ngnShort(amount: number): string {
  return ngn(amount).replace('.00', '');
}

function SetupBand({
  ring,
  icon,
  title,
  description,
  action,
  className,
}: {
  ring?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-4 rounded-btn bg-setup-band px-5 py-[18px]',
        className,
      )}
    >
      {ring && (
        <div
          aria-hidden
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-olive-deep"
          style={{
            background: `conic-gradient(var(--color-olive) 0 ${ring}, #DDE0C8 ${ring} 100%)`,
          }}
        >
          <span className="flex size-[34px] items-center justify-center rounded-full bg-setup-band">
            {ring}
          </span>
        </div>
      )}
      {icon}
      <div className="min-w-0 flex-1">
        <h4 className="text-base font-bold text-ink">{title}</h4>
        <p className="mt-0.5 text-[13px] text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const { data: offer } = useOffer();
  const { data: subscriptions } = useSubscriptions();
  const { data: me } = useMe();

  const invested = subscriptions?.reduce((sum, s) => sum + s.amountPaid, 0) ?? 0;
  const live = offer ? offer.status === 'live' : true;

  return (
    <PageTransition>
      {/* Account setup band */}
      <SetupBand
        ring={invested > 0 ? '40%' : '10%'}
        title="Get your money working"
        description="Finish setting up your account"
        action={
          <Button
            size="md"
            className="shrink-0"
            onClick={() => toast('Account setup checklist — [DEMO]')}
          >
            Finish Setup
          </Button>
        }
      />

      {/* IPO banner */}
      <div className="ipo-band-gradient mt-5 rounded-card px-7 py-[26px] text-[#F7F8EF]">
        <Badge
          variant="live"
          pulse={live}
          className="border border-white/35 bg-white/15 text-white"
        >
          {live ? 'Live now' : 'Opens soon'}
        </Badge>
        <h3 className="mt-1.5 text-[22px] font-bold tracking-[-0.02em]">{OFFER_NAME} IPO</h3>
        <p className="mt-1 max-w-[520px] text-sm leading-relaxed opacity-90">
          {live && offer
            ? `Africa's largest single-train refinery is open for public investment — from ${ngn(offer.minShares * offer.pricePerShare)}. Offer closes 31 Jul 2026.`
            : 'Join the waiting list and be first in when the offer opens.'}{' '}
          <DemoTag className="border-white/40 bg-white/20 text-white" />
        </p>
        <button
          type="button"
          className="mt-2 block py-2 text-sm font-bold text-[#F7F8EF] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-white"
          onClick={() => toast('Downloading the offer prospectus (PDF) — [DEMO]')}
        >
          📄 Download the offer prospectus
        </button>
        <Button variant="inverse" size="md" className="mt-3.5" onClick={() => navigate('/offers')}>
          View offer →
        </Button>
      </div>

      {/* Balance cards */}
      <div className="mt-5 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
        <BalanceCard label="Total balance" value={ngnShort(invested)} />
        <BalanceCard label="Portfolio balance" value={ngnShort(invested)}>
          {invested > 0 && (
            <Link
              to="/portfolio"
              className="mt-2 self-start text-sm font-semibold text-olive-deep underline-offset-2 hover:underline"
            >
              View portfolio →
            </Link>
          )}
        </BalanceCard>
        <BalanceCard label="Wallet balance" value="₦0">
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              onClick={() => toast('Add money — wallet funding is out of scope for this demo')}
            >
              <Plus className="size-3.5" aria-hidden /> Add Money
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toast('Withdraw — out of scope for this demo')}
            >
              <ArrowUpRight className="size-3.5" aria-hidden /> Withdraw
            </Button>
          </div>
        </BalanceCard>
      </div>

      {/* Phone verification nudge */}
      {me && !me.phoneVerified && (
        <SetupBand
          className="mt-5 bg-nudge-band"
          icon={<Smartphone className="size-6 shrink-0 text-amber-deep" aria-hidden />}
          title="Verify your phone number"
          description="So you don't miss communications from us — allotment updates, payment confirmations, offer news. You can update your number at any time."
          action={
            <Button asChild size="md" className="shrink-0">
              <Link to="/profile">Verify now</Link>
            </Button>
          }
        />
      )}
    </PageTransition>
  );
}
