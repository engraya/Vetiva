import { Banknote, CreditCard, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioCard } from '@/components/common/radio-card';
import { WarnBand } from '@/components/common/status-band';
import { DemoTag } from '@/components/common/demo-tag';
import { usePaymentMethods } from '@/features/offer/api';
import { calcTotals } from '@/lib/fees';
import { ngn, usd } from '@/lib/money';
import type { PaymentMethod } from '@/types/domain';

const ICONS = {
  bank: Banknote,
  card: CreditCard,
  globe: Globe,
} as const;

interface PaymentMethodListProps {
  shares: number;
  price: number;
  selectedId: string;
  onSelect: (method: PaymentMethod) => void;
}

export function PaymentMethodList({ shares, price, selectedId, onSelect }: PaymentMethodListProps) {
  const { data: methods, isPending } = usePaymentMethods();

  if (isPending) {
    return (
      <div className="mt-2 space-y-2.5">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-[72px] rounded-card" />
        ))}
      </div>
    );
  }

  const selected = methods?.find((m) => m.id === selectedId);
  const selectedTotals = selected ? calcTotals(selected, shares, price) : null;

  return (
    <div>
      {methods?.map((method) => {
        const totals = calcTotals(method, shares, price);
        const Icon = ICONS[method.icon];
        return (
          <RadioCard
            key={method.id}
            name="payment-method"
            checked={method.id === selectedId}
            onSelect={() => onSelect(method)}
          >
            <span className="flex items-center gap-3">
              <Icon className="size-5 shrink-0 text-olive-deep" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="text-sm font-bold text-ink">
                  {method.label}
                  {method.cheapest && (
                    <Badge variant="cheapest" className="ml-2">
                      Cheapest
                    </Badge>
                  )}
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  {method.feeLabel} <DemoTag />
                </span>
              </span>
              <span className="tabular shrink-0 text-right text-sm font-bold text-ink">
                {totals.totalUsd !== undefined ? (
                  <>
                    {usd(totals.totalUsd)}
                    <span className="block text-[11px] font-medium text-muted">
                      ≈ {ngn(totals.total)} @ ₦{totals.fxRate?.toLocaleString()}/$
                    </span>
                  </>
                ) : (
                  ngn(totals.total)
                )}
              </span>
            </span>
          </RadioCard>
        );
      })}

      {selectedTotals?.totalUsd !== undefined && (
        <WarnBand>
          💱 You'll be charged <strong>{usd(selectedTotals.totalUsd)}</strong> at{' '}
          <strong>₦{selectedTotals.fxRate?.toLocaleString()}/$</strong> — rate provided by
          Flutterwave, valid for this transaction. <DemoTag label="DEMO RATE" />
        </WarnBand>
      )}
    </div>
  );
}
