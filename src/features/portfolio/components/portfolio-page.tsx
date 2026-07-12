import { Card } from '@/components/ui/card';
import { BalanceCard } from '@/components/common/balance-card';
import { EmptyState } from '@/components/common/empty-state';
import { PageTransition } from '@/components/common/page-transition';
import { useOffer } from '@/features/offer/api';
import { useSubscriptions } from '@/features/subscription/api';
import { PositionCard } from '@/features/subscription/components/position-card';
import { OFFER_TICKER } from '@/constants/offer';
import { ngn } from '@/lib/money';

const DISTRIBUTION = [
  { label: 'Primary Offers (IPO)', swatch: '#78814B', invested: true },
  { label: 'Equity (Stocks)', swatch: '#8E2F3C', invested: false },
  { label: 'Fixed Income', swatch: '#2F4B8E', invested: false },
  { label: 'Mutual Funds', swatch: '#D89B3D', invested: false },
  { label: 'Trust', swatch: '#4B8E58', invested: false },
];

export function PortfolioPage() {
  const { data: offer } = useOffer();
  const { data: subscriptions } = useSubscriptions();
  const invested = subscriptions?.reduce((sum, s) => sum + s.amountPaid, 0) ?? 0;

  return (
    <PageTransition>
      <div className="max-w-[420px]">
        <BalanceCard label="Total portfolio value" value={ngn(invested).replace('.00', '')} />
      </div>

      <h3 className="mb-1.5 mt-[26px] text-base font-bold text-ink">Portfolio distribution</h3>
      <Card className="max-w-[560px] p-4 md:p-5">
        {DISTRIBUTION.map(({ label, swatch, invested: isIpo }) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-line py-[11px] text-sm last:border-0"
          >
            <span className="flex items-center">
              <span
                aria-hidden
                className="mr-2.5 inline-block size-2.5 rounded-[3px]"
                style={{ background: swatch }}
              />
              {label}
            </span>
            <b className="tabular">{isIpo ? ngn(invested) : '₦0.00'}</b>
          </div>
        ))}
      </Card>

      <h3 className="mb-3 mt-[26px] text-base font-bold text-ink">My holdings</h3>
      {subscriptions && subscriptions.length > 0 ? (
        <div className="max-w-[720px]">
          <PositionCard subscriptions={subscriptions} ticker={offer?.ticker ?? OFFER_TICKER} />
        </div>
      ) : (
        <EmptyState icon="📊">
          No holdings yet — subscribe to the {OFFER_TICKER} IPO to start building your portfolio.
        </EmptyState>
      )}
    </PageTransition>
  );
}
