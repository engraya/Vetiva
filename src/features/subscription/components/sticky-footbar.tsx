import { Button } from '@/components/ui/button';
import { ngn, usd } from '@/lib/money';
import type { OrderTotals } from '@/lib/fees';

interface StickyFootbarProps {
  label: string;
  totals: OrderTotals;
  submitLabel: string;
  canSubmit: boolean;
  submitting: boolean;
  onSubmit: () => void;
  missingRequirements?: string[];
}

/**
 * The approved one-pager's sticky footer: glass cream bar pinned to the
 * bottom of the scroll area (rounded + bordered inside the app shell),
 * showing the live amount above the submit button.
 */
export function StickyFootbar({
  label,
  totals,
  submitLabel,
  canSubmit,
  submitting,
  onSubmit,
  missingRequirements = [],
}: StickyFootbarProps) {
  return (
    <div className="glass sticky bottom-0 z-10 mt-6 rounded-btn border border-line px-5 pb-[18px] pt-3.5 shadow-[0_-8px_24px_-8px_rgb(24_26_16/0.12)]">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <span className="tabular text-xl font-extrabold text-ink">
          {totals.totalUsd !== undefined ? usd(totals.totalUsd) : ngn(totals.total)}
        </span>
      </div>
      <Button size="lg" disabled={!canSubmit} loading={submitting} onClick={onSubmit}>
        {submitLabel}
      </Button>
      {!canSubmit && !submitting && missingRequirements.length > 0 && (
        <ul className="mt-2.5 space-y-0.5 text-xs text-muted" aria-live="polite">
          {missingRequirements.map((req) => (
            <li key={req}>• {req}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
