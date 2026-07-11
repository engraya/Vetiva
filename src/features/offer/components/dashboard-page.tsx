import { useState } from 'react';
import { Link } from 'react-router';
import { Share2, Smartphone, TrendingUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/empty-state';
import { OkBand } from '@/components/common/status-band';
import { PageTransition } from '@/components/common/page-transition';
import { useOffer, useWaitlistStatus } from '@/features/offer/api';
import { useSubscriptions } from '@/features/subscription/api';
import { useMe } from '@/features/profile/api';
import { OfferHeroCard } from './offer-hero-card';
import { WaitlistDialog } from './waitlist-dialog';
import { OfferingsGrid } from './offerings-grid';
import { PositionStats } from '@/features/subscription/components/position-stats';
import { SubscriptionsTable } from '@/features/subscription/components/subscriptions-table';
import { shareOffer } from '@/lib/share';

export function DashboardPage() {
  const { data: offer, isPending: offerPending } = useOffer();
  const { data: subscriptions } = useSubscriptions();
  const { data: me } = useMe();
  const { data: waitlist } = useWaitlistStatus();
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  if (offerPending || !offer) {
    return (
      <div className="grid gap-4 lg:grid-cols-12">
        <Skeleton className="h-80 rounded-card lg:col-span-8" />
        <div className="space-y-4 lg:col-span-4">
          <Skeleton className="h-36 rounded-card" />
          <Skeleton className="h-40 rounded-card" />
        </div>
      </div>
    );
  }

  const hasSubscriptions = (subscriptions?.length ?? 0) > 0;
  const hasSelf = subscriptions?.some((s) => s.holderType === 'self') ?? false;
  const upcoming = offer.status === 'upcoming';
  const showNudge = me && !me.phoneVerified && !nudgeDismissed;

  return (
    <PageTransition>
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-[-0.025em] text-ink">
          {me ? `Good to see you, ${me.firstName}` : 'Dashboard'}
        </h1>
      </div>

      {showNudge && (
        <div className="mt-4 flex items-center gap-3 rounded-card border border-amber-line bg-[#FBF6E9] px-4 py-3">
          <Smartphone className="size-5 shrink-0 text-amber-deep" aria-hidden />
          <div className="min-w-0 flex-1 text-sm">
            <span className="font-bold text-ink">Verify your phone number</span>
            <span className="ml-1.5 hidden text-muted sm:inline">
              So you don't miss communications from us. Update it anytime.
            </span>
          </div>
          <Button asChild variant="link" size="bare" className="shrink-0 font-bold">
            <Link to="/profile">Verify →</Link>
          </Button>
          <button
            type="button"
            onClick={() => setNudgeDismissed(true)}
            aria-label="Dismiss"
            className="rounded-md p-1 text-muted hover:bg-amber-soft hover:text-ink"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      )}

      <div className="mt-5 grid gap-4 lg:grid-cols-12">
        {/* Offer hero */}
        <div className="lg:col-span-8">
          <OfferHeroCard offer={offer}>
            {upcoming && (
              <div className="mt-1">
                {waitlist?.joined ? (
                  <OkBand>
                    You're on the waiting list — we'll notify you the moment it opens.
                  </OkBand>
                ) : (
                  <WaitlistDialog />
                )}
              </div>
            )}
            {!upcoming && (
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <Button asChild size="lg" className="sm:flex-1">
                  <Link to={hasSelf ? '/subscribe?for=minor' : '/subscribe'}>
                    {hasSelf ? 'Subscribe for a child' : 'Subscribe now'}
                  </Link>
                </Button>
                {hasSubscriptions && (
                  <Button
                    variant="ghost"
                    size="lg"
                    className="sm:flex-1"
                    onClick={() => void shareOffer()}
                  >
                    <Share2 className="size-4" aria-hidden />
                    Share this IPO
                  </Button>
                )}
              </div>
            )}
          </OfferHeroCard>
        </div>

        {/* Right rail */}
        <div className="lg:col-span-4">
          {hasSubscriptions && subscriptions ? (
            <PositionStats subscriptions={subscriptions} ticker={offer.ticker} />
          ) : (
            <EmptyState
              className="h-full"
              icon={<TrendingUp className="size-7" aria-hidden />}
              title={upcoming ? 'No position yet' : "You haven't subscribed yet"}
              description={
                upcoming
                  ? 'Join the waiting list and be first in when the offer opens.'
                  : `Subscribe from ${offer.minShares.toLocaleString()} shares and your position will appear here.`
              }
              action={
                !upcoming && (
                  <Button asChild size="md">
                    <Link to="/subscribe">Subscribe now</Link>
                  </Button>
                )
              }
            />
          )}
        </div>
      </div>

      {hasSubscriptions && subscriptions && <SubscriptionsTable subscriptions={subscriptions} />}

      {upcoming && <OfferingsGrid />}
    </PageTransition>
  );
}
