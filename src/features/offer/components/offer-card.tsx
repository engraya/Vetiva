import { Link } from 'react-router';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Play, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, SummaryRow } from '@/components/ui/card';
import { CountdownTimer } from '@/components/common/countdown-timer';
import { OkBand } from '@/components/common/status-band';
import { DemoTag } from '@/components/common/demo-tag';
import { WaitlistDialog } from './waitlist-dialog';
import { useWaitlistStatus } from '@/features/offer/api';
import { seedScenario } from '@/mocks/db';
import { shareOffer } from '@/lib/share';
import { ngn } from '@/lib/money';
import { formatDateTime } from '@/lib/utils';
import type { Offer } from '@/types/domain';

interface OfferCardProps {
  offer: Offer;
  subscribed: boolean;
  hasSelf: boolean;
}

/** The approved offer detail card (live and pre-live variants). */
export function OfferCard({ offer, subscribed, hasSelf }: OfferCardProps) {
  const { data: waitlist } = useWaitlistStatus();
  const queryClient = useQueryClient();
  const live = offer.status === 'live';

  function simulateLive() {
    // Mirrors the approved flow's presenter shortcut on the pre-live card
    seedScenario('live-fresh');
    void queryClient.invalidateQueries();
    toast('Demo: offer switched to LIVE');
  }

  return (
    <Card className="p-4 md:p-5">
      {live ? (
        <Badge variant="live" pulse>
          Live
        </Badge>
      ) : (
        <Badge variant="soon">Opens soon</Badge>
      )}

      <h2 className="mb-1 mt-2.5 text-xl font-bold leading-snug tracking-[-0.02em] text-ink">
        {offer.name} <span className="font-semibold text-muted">({offer.ticker})</span>
      </h2>

      {live ? (
        <>
          <SummaryRow
            label="Price per share"
            value={
              <>
                {ngn(offer.pricePerShare)} <DemoTag />
              </>
            }
          />
          <SummaryRow
            label="Minimum"
            value={`${offer.minShares.toLocaleString()} shares (${ngn(offer.minShares * offer.pricePerShare)})`}
          />
          <SummaryRow
            label="Offer closes"
            value={
              <>
                {formatDateTime(offer.closesAt)} <DemoTag />
              </>
            }
          />
          <p className="mt-2 text-xs text-muted">Offer closes in:</p>
          <CountdownTimer targetIso={offer.closesAt} label="Time until the offer closes" />
          <Button
            variant="link"
            size="bare"
            className="mt-2.5"
            onClick={() => toast('Downloading the offer prospectus (PDF) — [DEMO]')}
          >
            Download the offer prospectus →
          </Button>
          <div className="mt-3.5">
            <Button asChild size="lg">
              <Link to={hasSelf ? '/subscribe?for=minor' : '/subscribe'}>
                {subscribed ? 'Subscribe for a child' : 'Subscribe now'}
              </Link>
            </Button>
            {subscribed && (
              <Button
                variant="ghost"
                size="lg"
                className="mt-2.5"
                onClick={() => void shareOffer()}
              >
                <Share2 className="size-4" aria-hidden /> Share this IPO
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <SummaryRow
            label="Offer opens"
            value={
              <>
                {formatDateTime(offer.opensAt)} <DemoTag />
              </>
            }
          />
          <p className="mt-2 text-xs text-muted">Offer opens in:</p>
          <CountdownTimer targetIso={offer.opensAt} label="Time until the offer opens" />
          <div className="mt-4">
            {waitlist?.joined ? (
              <OkBand>You're on the waiting list — we'll notify you the moment it opens.</OkBand>
            ) : (
              <WaitlistDialog />
            )}
          </div>
          <Button
            variant="link"
            size="bare"
            className="mt-2"
            onClick={() => toast('Downloading the offer prospectus (PDF) — [DEMO]')}
          >
            Download the offer prospectus →
          </Button>
          <Button variant="ghost" size="lg" className="mt-3.5" onClick={simulateLive}>
            <Play className="size-4" aria-hidden /> Demo: simulate offer going live
          </Button>
        </>
      )}
    </Card>
  );
}
