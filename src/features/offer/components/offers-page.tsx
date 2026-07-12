import { useSearchParams } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/empty-state';
import { PageTransition } from '@/components/common/page-transition';
import { useOffer } from '@/features/offer/api';
import { useSubscriptions } from '@/features/subscription/api';
import { PositionCard } from '@/features/subscription/components/position-card';
import { OfferCard } from './offer-card';
import { OFFER_TICKER } from '@/constants/offer';
import { cn } from '@/lib/utils';

type Tab = 'available' | 'history';
type Chip = 'all' | 'primary' | 'rights';

const CHIPS: { key: Chip; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'primary', label: 'Primary Offers' },
  { key: 'rights', label: 'Rights Issue' },
];

export function OffersPage() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') === 'history' ? 'history' : 'available') as Tab;
  const chip = (
    ['primary', 'rights'].includes(params.get('type') ?? '') ? params.get('type') : 'all'
  ) as Chip;

  const { data: offer, isPending: offerPending } = useOffer();
  const { data: subscriptions } = useSubscriptions();

  const subscribed = (subscriptions?.length ?? 0) > 0;
  const hasSelf = subscriptions?.some((s) => s.holderType === 'self') ?? false;

  function setTab(next: Tab) {
    setParams(next === 'available' ? {} : { tab: next });
  }
  function setChip(next: Chip) {
    setParams(next === 'all' ? {} : { type: next });
  }

  return (
    <PageTransition>
      {/* Offers banner */}
      <div className="offers-band-gradient mb-[26px] rounded-card px-10 py-11 text-[clamp(1.6rem,3vw,2.4rem)] font-bold tracking-[-0.02em] text-[#F7F8EF]">
        Explore. Invest. Own.
      </div>

      {/* Tabs */}
      <div className="mb-[18px] flex border-b-2 border-line" role="tablist" aria-label="Offers">
        {(
          [
            { key: 'available', label: 'Available Offers' },
            { key: 'history', label: 'Purchase History' },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              '-mb-0.5 flex-1 border-b-2 px-1 py-3 text-[15px] font-semibold transition-colors',
              'focus-visible:outline-2 focus-visible:outline-olive',
              tab === key
                ? 'border-olive-deep text-olive-deep'
                : 'border-transparent text-muted hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filter chips (available tab only) */}
      {tab === 'available' && (
        <div className="mb-5 flex gap-3.5">
          {CHIPS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              aria-pressed={chip === key}
              onClick={() => setChip(key)}
              className={cn(
                'rounded-[10px] px-[18px] py-[9px] text-sm font-semibold transition-colors',
                'focus-visible:outline-2 focus-visible:outline-olive',
                chip === key ? 'bg-olive text-white' : 'text-ink hover:bg-olive-soft',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Body */}
      {tab === 'history' ? (
        subscribed && subscriptions ? (
          <div className="max-w-[720px]">
            <PositionCard subscriptions={subscriptions} ticker={offer?.ticker ?? OFFER_TICKER} />
          </div>
        ) : (
          <EmptyState icon="🗂️">
            No purchases yet.
            <br />
            Your IPO subscriptions and receipts will appear here.
          </EmptyState>
        )
      ) : chip === 'rights' ? (
        <EmptyState icon="📭">No rights issues available right now.</EmptyState>
      ) : offerPending || !offer ? (
        <Skeleton className="h-96 max-w-[720px] rounded-card" />
      ) : (
        <div className="max-w-[720px] space-y-3.5">
          {subscribed && subscriptions && (
            <PositionCard subscriptions={subscriptions} ticker={offer.ticker} />
          )}
          <OfferCard offer={offer} subscribed={subscribed} hasSelf={hasSelf} />
        </div>
      )}
    </PageTransition>
  );
}
