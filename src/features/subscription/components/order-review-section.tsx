import { Card, SummaryRow } from '@/components/ui/card';
import { CheckboxLine } from '@/components/ui/checkbox';
import { DangerBox } from '@/components/common/status-band';
import { ngn, usd } from '@/lib/money';
import type { OrderTotals } from '@/lib/fees';
import type { PaymentMethod } from '@/types/domain';

interface OrderReviewSectionProps {
  kind: 'subscription' | 'topup';
  shares: number;
  price: number;
  method: PaymentMethod;
  totals: OrderTotals;
  acknowledged: boolean;
  onAcknowledge: (checked: boolean) => void;
}

/** Inline summary card + irreversibility notice, per the approved one-pager. */
export function OrderReviewSection({
  kind,
  shares,
  price,
  method,
  totals,
  acknowledged,
  onAcknowledge,
}: OrderReviewSectionProps) {
  const isTopup = kind === 'topup';
  return (
    <section>
      <Card className="p-4 md:p-4">
        <SummaryRow
          label={`${shares.toLocaleString()} shares × ${ngn(price)}`}
          value={ngn(totals.amount)}
        />
        <SummaryRow
          label={`Payment fee · ${method.label}`}
          value={totals.fee > 0 ? ngn(totals.fee) : '₦0.00'}
        />
        <div className="mt-1.5 flex items-center justify-between border-t border-line pt-3">
          <span className="text-sm font-bold text-ink">Total</span>
          <span className="tabular text-right text-base font-extrabold text-ink">
            {totals.totalUsd !== undefined
              ? `${usd(totals.totalUsd)} (≈ ${ngn(totals.total)})`
              : ngn(totals.total)}
          </span>
        </div>
      </Card>

      <DangerBox
        title={
          isTopup ? 'Top-up is final and irreversible' : 'Subscription is final and irreversible'
        }
      >
        {isTopup
          ? 'Once payment is made, funds are committed for allotment and cannot be reversed.'
          : 'Once payment is made, your funds are committed for allotment. This subscription cannot be cancelled or reversed.'}
      </DangerBox>

      <CheckboxLine
        checked={acknowledged}
        onChange={(e) => onAcknowledge(e.target.checked)}
        label={<strong>I understand and agree.</strong>}
      />
    </section>
  );
}
