import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageTransition } from '@/components/common/page-transition';
import { useOffer } from '@/features/offer/api';
import { useSubscriptions, useTopUp } from '@/features/subscription/api';
import { useOrderStore } from '@/features/subscription/store';
import { PAYMENT_METHODS } from '@/constants/payments';
import { PRICE_PER_SHARE, TOPUP_MIN_SHARES } from '@/constants/offer';
import { calcTotals } from '@/lib/fees';
import { ngn } from '@/lib/money';
import { apiErrorMessage } from '@/lib/axios';
import type { PaymentMethod } from '@/types/domain';
import { Section } from './section';
import { SharesSection } from './shares-section';
import { PaymentMethodList } from './payment-method-list';
import { OrderSummaryPanel } from './order-summary-panel';
import { ProcessingOverlay } from './processing-overlay';

export function TopUpPage() {
  const { accountId } = useParams<'accountId'>();
  const navigate = useNavigate();
  const { data: offer } = useOffer();
  const { data: subscriptions, isPending } = useSubscriptions();
  const setOrder = useOrderStore((s) => s.setOrder);
  const topUp = useTopUp();

  const [shares, setShares] = useState(TOPUP_MIN_SHARES);
  const [method, setMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0]!);
  const [acknowledged, setAcknowledged] = useState(false);

  const price = offer?.pricePerShare ?? PRICE_PER_SHARE;

  if (isPending) {
    return (
      <div className="grid gap-5 lg:grid-cols-12">
        <Skeleton className="h-96 rounded-card lg:col-span-7" />
        <Skeleton className="h-80 rounded-card lg:col-span-5" />
      </div>
    );
  }

  const subscription = subscriptions?.find((s) => s.id === accountId);
  if (!subscription) return <Navigate to="/dashboard" replace />;

  const who = subscription.holderType === 'self' ? 'You' : subscription.holderName;
  const canSubmit = acknowledged && shares >= TOPUP_MIN_SHARES;

  function submit() {
    if (!canSubmit || !subscription) return;
    topUp.mutate(
      { id: subscription.id, shares, paymentMethodId: method.id },
      {
        onSuccess: (order) => {
          setOrder(order);
          navigate('/subscription/success');
        },
        onError: (error) => toast.error(apiErrorMessage(error)),
      },
    );
  }

  return (
    <PageTransition>
      {topUp.isPending && (
        <ProcessingOverlay method={method} totals={calcTotals(method, shares, price)} />
      )}

      <h1 className="text-2xl font-bold tracking-[-0.025em] text-ink">Top up</h1>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <Card className="p-4 md:p-5">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted">Current position · {who}</span>
              <span className="tabular font-semibold text-ink">
                {subscription.shares.toLocaleString()} shares · {ngn(subscription.amountPaid)}
              </span>
            </div>
            <p className="tabular mt-1.5 text-xs text-muted">
              CSCS {subscription.cscs} — nothing else to re-enter. Just choose shares and pay.
            </p>
          </Card>

          <SharesSection
            step={1}
            title="How many more shares?"
            value={shares}
            floor={TOPUP_MIN_SHARES}
            price={price}
            onChange={setShares}
          />

          <Section
            step={2}
            icon={<CreditCard className="size-[18px]" aria-hidden />}
            title="How would you like to pay?"
          >
            <PaymentMethodList
              shares={shares}
              price={price}
              selectedId={method.id}
              onSelect={setMethod}
            />
          </Section>
        </div>

        <div className="lg:col-span-5">
          <OrderSummaryPanel
            kind="topup"
            shares={shares}
            price={price}
            method={method}
            acknowledged={acknowledged}
            onAcknowledge={setAcknowledged}
            canSubmit={canSubmit}
            submitting={topUp.isPending}
            onSubmit={submit}
            missingRequirements={acknowledged ? [] : ['Accept the irreversibility notice']}
          />
        </div>
      </div>
    </PageTransition>
  );
}
