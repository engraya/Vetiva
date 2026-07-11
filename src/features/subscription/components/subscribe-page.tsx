import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { CreditCard, Ticket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DemoTag } from '@/components/common/demo-tag';
import { PageTransition } from '@/components/common/page-transition';
import { useAuthStore } from '@/features/auth/store';
import { useOffer } from '@/features/offer/api';
import { useCreateSubscription, useSubscriptions } from '@/features/subscription/api';
import { useOrderStore } from '@/features/subscription/store';
import { PAYMENT_METHODS } from '@/constants/payments';
import { MIN_SHARES, PRICE_PER_SHARE } from '@/constants/offer';
import { calcTotals } from '@/lib/fees';
import { ngn } from '@/lib/money';
import { apiErrorMessage } from '@/lib/axios';
import type { DividendAccount, NinVerifyResponse } from '@/types/api';
import type { HolderType, PaymentMethod } from '@/types/domain';
import { Section } from './section';
import { WhoForSection } from './who-for-section';
import { SharesSection } from './shares-section';
import { CscsSection } from './cscs-section';
import { DividendSection } from './dividend-section';
import { PaymentMethodList } from './payment-method-list';
import { OrderSummaryPanel } from './order-summary-panel';
import { ProcessingOverlay } from './processing-overlay';

export function SubscribePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { data: offer } = useOffer();
  const { data: subscriptions } = useSubscriptions();
  const setOrder = useOrderStore((s) => s.setOrder);
  const createSubscription = useCreateSubscription();

  const [mode, setMode] = useState<HolderType>(params.get('for') === 'minor' ? 'minor' : 'self');
  const [child, setChild] = useState<NinVerifyResponse | null>(null);
  const [childNin, setChildNin] = useState('');
  const [shares, setShares] = useState(MIN_SHARES);
  const [cscs, setCscs] = useState<string | null>(null);
  const [dividend, setDividend] = useState<DividendAccount | 'guardian' | null>(null);
  const [invitationCode, setInvitationCode] = useState('');
  const [method, setMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0]!);
  const [acknowledged, setAcknowledged] = useState(false);

  const price = offer?.pricePerShare ?? PRICE_PER_SHARE;
  const selfSubscription = subscriptions?.find((s) => s.holderType === 'self');

  const missingRequirements = useMemo(() => {
    const missing: string[] = [];
    if (mode === 'self' && selfSubscription)
      missing.push('Self-subscriptions can only be topped up');
    if (mode === 'minor' && !child) missing.push("Verify the child's NIN");
    if (!cscs) missing.push('Provide or create a CSCS account');
    if (!dividend) missing.push('Add a dividend bank account');
    if (!acknowledged) missing.push('Accept the irreversibility notice');
    return missing;
  }, [mode, selfSubscription, child, cscs, dividend, acknowledged]);

  const canSubmit = missingRequirements.length === 0 && shares >= MIN_SHARES;

  function submit() {
    if (!canSubmit || !cscs || !dividend) return;
    createSubscription.mutate(
      {
        offerId: offer?.id ?? 'dprp-2026',
        holder: mode,
        minorNin: mode === 'minor' ? childNin : undefined,
        shares,
        cscs,
        dividendAccount: dividend,
        paymentMethodId: method.id,
        invitationCode: mode === 'self' && invitationCode ? invitationCode : undefined,
      },
      {
        onSuccess: (order) => {
          setOrder(order);
          navigate('/subscription/success');
        },
        onError: (error) => toast.error(apiErrorMessage(error)),
      },
    );
  }

  if (!user) return null;

  return (
    <PageTransition>
      {createSubscription.isPending && (
        <ProcessingOverlay method={method} totals={calcTotals(method, shares, price)} />
      )}

      <h1 className="text-2xl font-bold tracking-[-0.025em] text-ink">Subscribe</h1>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-12">
        {/* Form column */}
        <div className="space-y-4 lg:col-span-7">
          {/* Offer strip */}
          <Card className="flex items-center justify-between gap-4 p-4 md:p-4">
            <div className="min-w-0">
              <div className="text-sm font-bold text-ink">{offer?.name}</div>
              <div className="mt-0.5 text-xs text-muted">
                ({offer?.ticker}) · {ngn(price)}/share <DemoTag /> · closes 31 Jul
              </div>
            </div>
            <Badge variant="live" pulse>
              Live
            </Badge>
          </Card>

          <WhoForSection
            mode={mode}
            onModeChange={setMode}
            userName={user.name}
            selfSubscription={selfSubscription}
            child={child}
            onChildChange={(c, nin) => {
              setChild(c);
              setChildNin(nin);
            }}
          />

          <SharesSection
            step={2}
            title="Number of shares"
            value={shares}
            floor={MIN_SHARES}
            price={price}
            showMinimum={MIN_SHARES}
            onChange={setShares}
          />

          <CscsSection
            mode={mode}
            childName={child?.name ?? null}
            childNin={childNin}
            userName={user.name}
            onResolved={setCscs}
          />

          <DividendSection mode={mode} user={user} onResolved={setDividend} />

          {mode === 'self' && (
            <Section
              step={5}
              icon={<Ticket className="size-[18px]" aria-hidden />}
              title={
                <>
                  Invitation code <span className="font-semibold text-muted">(Optional)</span>
                </>
              }
            >
              <Input
                className="mt-3"
                placeholder="e.g. DPRP-AOK24"
                aria-label="Invitation code"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
              />
            </Section>
          )}

          <Section
            step={mode === 'self' ? 6 : 5}
            icon={<CreditCard className="size-[18px]" aria-hidden />}
            title="How would you like to pay?"
            description="Fees are added on top of your subscription. The amount shown is the final total you'll pay."
          >
            <PaymentMethodList
              shares={shares}
              price={price}
              selectedId={method.id}
              onSelect={setMethod}
            />
          </Section>
        </div>

        {/* Sticky summary column */}
        <div className="lg:col-span-5">
          <OrderSummaryPanel
            kind="subscription"
            shares={shares}
            price={price}
            method={method}
            acknowledged={acknowledged}
            onAcknowledge={setAcknowledged}
            canSubmit={canSubmit}
            submitting={createSubscription.isPending}
            onSubmit={submit}
            missingRequirements={missingRequirements}
          />
        </div>
      </div>
    </PageTransition>
  );
}
