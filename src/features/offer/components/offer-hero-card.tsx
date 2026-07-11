import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, SummaryRow } from '@/components/ui/card';
import { CountdownTimer } from '@/components/common/countdown-timer';
import { DemoTag } from '@/components/common/demo-tag';
import { ngn } from '@/lib/money';
import { formatDateTime } from '@/lib/utils';
import type { Offer } from '@/types/domain';

export function OfferHeroCard({ offer, children }: { offer: Offer; children?: React.ReactNode }) {
  const upcoming = offer.status === 'upcoming';

  return (
    <Card
      className="h-full"
      style={upcoming ? { background: 'linear-gradient(150deg, #FFFFFF, #F4F3E7)' } : undefined}
    >
      {upcoming ? (
        <Badge variant="soon">Opens soon</Badge>
      ) : (
        <Badge variant="live" pulse>
          Live
        </Badge>
      )}

      <h2 className="mt-3 text-[22px] font-bold leading-snug tracking-[-0.02em] text-ink">
        {offer.name} <span className="font-semibold text-muted">({offer.ticker})</span>
      </h2>

      <div className="mt-3">
        {upcoming ? (
          <SummaryRow
            label="Offer opens"
            value={
              <>
                {formatDateTime(offer.opensAt)} <DemoTag />
              </>
            }
          />
        ) : (
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
          </>
        )}
      </div>

      <p className="mt-2 text-xs text-muted">{upcoming ? 'Offer opens in:' : 'Offer closes in:'}</p>
      <CountdownTimer
        targetIso={upcoming ? offer.opensAt : offer.closesAt}
        label={upcoming ? 'Time until the offer opens' : 'Time until the offer closes'}
      />

      {children}

      <Button
        variant="link"
        size="bare"
        className="mt-3"
        onClick={() => toast('Downloading the offer prospectus (PDF) — [DEMO]')}
      >
        Download the offer prospectus →
      </Button>
    </Card>
  );
}
