import { Card, SummaryRow } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckboxLine } from '@/components/ui/checkbox';
import { DangerBox } from '@/components/common/status-band';
import { calcTotals } from '@/lib/fees';
import { ngn, usd } from '@/lib/money';
import type { PaymentMethod } from '@/types/domain';

interface OrderSummaryPanelProps {
  kind: 'subscription' | 'topup';
  shares: number;
  price: number;
  method: PaymentMethod | null;
  acknowledged: boolean;
  onAcknowledge: (checked: boolean) => void;
  canSubmit: boolean;
  submitting: boolean;
  onSubmit: () => void;
  missingRequirements?: string[];
}

/**
 * Desktop replacement for the mobile sticky footer: an always-visible
 * order summary with the irreversibility acknowledgement and submit.
 */
export function OrderSummaryPanel({
  kind,
  shares,
  price,
  method,
  acknowledged,
  onAcknowledge,
  canSubmit,
  submitting,
  onSubmit,
  missingRequirements = [],
}: OrderSummaryPanelProps) {
  const totals = method ? calcTotals(method, shares, price) : null;
  const isTopup = kind === 'topup';

  return (
    <div className="lg:sticky lg:top-24">
      <Card>
        <h2 className="text-[15px] font-bold text-ink">Order summary</h2>
        <div className="mt-2">
          <SummaryRow
            label={`${shares.toLocaleString()} shares × ${ngn(price)}`}
            value={ngn(shares * price)}
          />
          <SummaryRow
            label={method ? `Payment fee · ${method.label}` : 'Payment fee'}
            value={totals ? (totals.fee > 0 ? ngn(totals.fee) : '₦0.00') : '—'}
          />
          <div className="mt-1.5 flex items-center justify-between border-t border-line pt-3">
            <span className="text-sm font-bold text-ink">{isTopup ? 'Top-up total' : 'Total'}</span>
            <span className="tabular text-right text-lg font-extrabold text-ink">
              {totals
                ? totals.totalUsd !== undefined
                  ? `${usd(totals.totalUsd)} (≈ ${ngn(totals.total)})`
                  : ngn(totals.total)
                : '—'}
            </span>
          </div>
        </div>

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

        <Button
          size="lg"
          className="mt-5"
          disabled={!canSubmit}
          loading={submitting}
          onClick={onSubmit}
        >
          {isTopup ? 'Pay top-up' : 'Submit subscription'}
        </Button>

        {!canSubmit && !submitting && missingRequirements.length > 0 && (
          <ul className="mt-3 space-y-1 text-xs text-muted" aria-live="polite">
            {missingRequirements.map((req) => (
              <li key={req}>• {req}</li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
