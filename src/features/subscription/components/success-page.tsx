import { Link, Navigate, useNavigate } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';
import { Baby, Check, Plus, Receipt, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, SummaryRow } from '@/components/ui/card';
import { Timeline } from '@/components/common/timeline';
import { DemoTag } from '@/components/common/demo-tag';
import { PageTransition } from '@/components/common/page-transition';
import { useAuthStore } from '@/features/auth/store';
import { useOrderStore } from '@/features/subscription/store';
import { PAYMENT_METHODS } from '@/constants/payments';
import { ngn } from '@/lib/money';
import { shareOffer } from '@/lib/share';
import { OFFER_NAME } from '@/constants/offer';

export function SuccessPage() {
  const user = useAuthStore((s) => s.user);
  const order = useOrderStore((s) => s.lastOrder);
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  if (!order || !user) return <Navigate to="/dashboard" replace />;

  const isTopup = order.kind === 'topup';
  const isMinor = order.holderType === 'minor';
  const method = PAYMENT_METHODS.find((m) => m.id === order.paymentMethodId);
  const who = isMinor ? (order.minorName ?? order.holderName) : null;

  return (
    <PageTransition>
      <div className="mx-auto max-w-[600px]">
        {/* Halo */}
        <motion.div
          initial={reduced ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="mx-auto mt-4 flex size-[130px] items-center justify-center rounded-full bg-[#DFF0E5]"
          aria-hidden
        >
          <div
            className="flex size-[86px] items-center justify-center rounded-full text-white shadow-halo"
            style={{ background: 'radial-gradient(circle at 35% 30%, #33B56C, var(--color-good))' }}
          >
            <Check className="size-9" strokeWidth={3} />
          </div>
        </motion.div>

        <h1 className="mt-5 text-center text-[26px] font-bold tracking-[-0.025em] text-ink">
          {isTopup ? 'Top-up successful!' : 'Subscription submitted!'}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-center text-[15px] leading-relaxed text-muted">
          Thank you, {user.firstName}.{' '}
          {isTopup
            ? `Your top-up of ${order.shares.toLocaleString()} shares has been added.`
            : `Your subscription for ${order.shares.toLocaleString()} shares of the ${OFFER_NAME} IPO has been received successfully${who ? ` for ${who}` : ''}.`}
        </p>

        <Card className="mt-6">
          <div className="border-b border-line pb-4 text-center">
            <div className="text-xs text-muted">
              {isTopup ? 'Amount paid (this top-up)' : 'Amount invested'}
            </div>
            <div className="tabular mt-1 text-3xl font-extrabold tracking-tight text-ink">
              {ngn(order.total)}
            </div>
            <div className="mt-1 text-xs text-muted">
              {order.fee > 0 ? (
                <>
                  incl. {ngn(order.fee)} payment fee · {method?.label} <DemoTag />
                </>
              ) : (
                <>{method?.label} · no fee</>
              )}
            </div>
          </div>
          <div className="pt-2">
            <SummaryRow
              label={isTopup ? 'Total shares' : 'Shares'}
              value={
                isTopup
                  ? `${order.positionShares.toLocaleString()} (${order.positionPayments} payments · ${ngn(order.positionPaid)})`
                  : order.shares.toLocaleString()
              }
            />
            <SummaryRow label="CSCS account" value={order.cscs} />
            {who && <SummaryRow label="Account holder" value={`${who} (guardian: you)`} />}
          </div>
        </Card>

        <h2 className="mt-7 text-[15px] font-bold text-ink">What happens next</h2>
        <Timeline
          className="mt-3"
          steps={[
            { title: 'Application created', done: true },
            { title: 'Funds received', done: true },
            { title: 'CSCS account linked', done: true },
            {
              title: 'Allotment',
              done: false,
              description:
                'Expected by 8 Aug 2026 [DEMO]. If the offer is oversubscribed, your allotment may be scaled back.',
            },
            { title: 'Shares credited to CSCS account', done: false },
            {
              title: 'Listing day',
              done: false,
              description: 'You can trade your shares from this date',
            },
          ]}
        />

        <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
          <Button size="lg" onClick={() => void shareOffer()}>
            <Share2 className="size-4" aria-hidden />
            Share this IPO
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate(`/top-up/${order.subscriptionId}`)}
          >
            <Plus className="size-4" aria-hidden />
            Top up this subscription
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link to="/subscribe?for=minor">
              <Baby className="size-4" aria-hidden />
              Subscribe for {isMinor ? 'another' : 'a'} child
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => toast('Receipt PDF downloaded — [DEMO]')}
          >
            <Receipt className="size-4" aria-hidden />
            Download receipt
          </Button>
        </div>

        {!user.phoneVerified && (
          <p className="mt-5 text-center text-xs leading-relaxed text-muted">
            📱 Tip: verify your phone number so you don't miss updates about your allotment.{' '}
            <Link
              to="/profile"
              className="font-semibold text-olive-deep underline-offset-2 hover:underline"
            >
              Verify in profile →
            </Link>
          </p>
        )}

        <div className="mt-6 text-center">
          <Button asChild variant="link" size="bare">
            <Link to="/dashboard">Done</Link>
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
