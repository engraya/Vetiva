import { StatCard } from '@/components/common/stat-card';
import { ngn } from '@/lib/money';
import type { Subscription } from '@/types/domain';

/** Desktop stat cards replacing the mobile gradient position card's numbers. */
export function PositionStats({
  subscriptions,
  ticker,
}: {
  subscriptions: Subscription[];
  ticker: string;
}) {
  const totalShares = subscriptions.reduce((sum, s) => sum + s.shares, 0);
  const totalPaid = subscriptions.reduce((sum, s) => sum + s.amountPaid, 0);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
      <div
        className="relative col-span-2 overflow-hidden rounded-card p-5 text-[#F5F4E8] shadow-pos lg:col-span-1"
        style={{
          background:
            'linear-gradient(155deg, #8D9760, var(--color-olive) 45%, var(--color-olive-deep))',
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-1/4 -top-2/5 size-[140%]"
          style={{
            background: 'radial-gradient(circle, rgb(255 255 255 / 0.10), transparent 60%)',
          }}
        />
        <div className="text-[11px] uppercase tracking-[0.05em] opacity-85">
          Your {ticker} position
        </div>
        <div className="tabular mt-1 text-[26px] font-extrabold">
          {totalShares.toLocaleString()} shares
        </div>
        <div className="tabular mt-0.5 text-sm opacity-90">
          {ngn(totalPaid)} across {subscriptions.length} account
          {subscriptions.length > 1 ? 's' : ''}
        </div>
      </div>
      <StatCard label="Total invested" value={ngn(totalPaid)} />
      <StatCard
        label="Payments made"
        value={subscriptions.reduce((sum, s) => sum + s.payments, 0)}
        sub="Across all accounts"
      />
    </div>
  );
}
