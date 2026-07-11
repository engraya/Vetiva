import { Spinner } from '@/components/common/spinner';
import { DemoTag } from '@/components/common/demo-tag';
import { ngn, usd } from '@/lib/money';
import type { OrderTotals } from '@/lib/fees';
import type { PaymentMethod } from '@/types/domain';

interface ProcessingOverlayProps {
  method: PaymentMethod;
  totals: OrderTotals;
}

/** Full-screen payment-processing state, mirroring the prototype's beat. */
export function ProcessingOverlay({ method, totals }: ProcessingOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream/95 p-6 text-center backdrop-blur-sm"
      role="alert"
      aria-busy="true"
    >
      <Spinner label="Processing payment" />
      <h2 className="mt-6 text-2xl font-bold tracking-[-0.025em] text-ink">
        {method.id === 'transfer' ? 'Confirming your transfer…' : 'Processing payment…'}
      </h2>
      <p className="tabular mt-2 text-[15px] text-muted">
        {method.label} · {totals.totalUsd !== undefined ? usd(totals.totalUsd) : ngn(totals.total)}
      </p>
      <p className="mt-3">
        <DemoTag label="DEMO — completes instantly" />
      </p>
    </div>
  );
}
