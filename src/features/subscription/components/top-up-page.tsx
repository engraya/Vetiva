import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TopNav } from '@/components/common/top-nav';
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
import { OrderReviewSection } from './order-review-section';
import { StickyFootbar } from './sticky-footbar';
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
  const totals = calcTotals(method, shares, price);

  if (isPending) {
    return <Skeleton className="h-96 max-w-[720px] rounded-card" />;
  }

  const subscription = subscriptions?.find((s) => s.id === accountId);
  if (!subscription) return <Navigate to="/offers" replace />;

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
      {topUp.isPending && <ProcessingOverlay method={method} totals={totals} />}

      <div className="flex min-h-full max-w-[720px] flex-col">
        <TopNav title="Top up" onBack={() => navigate(-1)} />

        <Card className="p-4 md:p-4">
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
          title="How many more shares?"
          value={shares}
          floor={TOPUP_MIN_SHARES}
          price={price}
          onChange={setShares}
        />

        <Section
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

        <div className="mt-6">
          <OrderReviewSection
            kind="topup"
            shares={shares}
            price={price}
            method={method}
            totals={totals}
            acknowledged={acknowledged}
            onAcknowledge={setAcknowledged}
          />
        </div>

        <StickyFootbar
          label="Top-up amount"
          totals={totals}
          submitLabel="Pay top-up"
          canSubmit={canSubmit}
          submitting={topUp.isPending}
          onSubmit={submit}
          missingRequirements={acknowledged ? [] : ['Accept the irreversibility notice']}
        />
      </div>
    </PageTransition>
  );
}
