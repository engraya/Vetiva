import { Link } from 'react-router';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ngn } from '@/lib/money';
import type { Subscription } from '@/types/domain';

/**
 * Approved position block: gradient "poscard" summary followed by the
 * "Your subscriptions" list with per-row Top up pills.
 */
export function PositionCard({
  subscriptions,
  ticker,
}: {
  subscriptions: Subscription[];
  ticker: string;
}) {
  const totalShares = subscriptions.reduce((sum, s) => sum + s.shares, 0);
  const totalPaid = subscriptions.reduce((sum, s) => sum + s.amountPaid, 0);

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-card p-5 text-[#F5F4E8] shadow-pos"
        style={{
          background:
            'linear-gradient(155deg, #8D9760, var(--color-olive) 45%, var(--color-olive-deep))',
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-1/5 -top-2/5 size-[140%]"
          style={{
            background: 'radial-gradient(circle, rgb(255 255 255 / 0.10), transparent 60%)',
          }}
        />
        <div className="text-[11px] uppercase tracking-[0.05em] opacity-85">
          Your {ticker} position
        </div>
        <div className="tabular mt-1 text-2xl font-extrabold">
          {totalShares.toLocaleString()} shares
        </div>
        <div className="tabular mt-0.5 text-sm opacity-90">
          {ngn(totalPaid)} across {subscriptions.length} account
          {subscriptions.length > 1 ? 's' : ''}
        </div>
      </div>

      <Card className="mt-3 p-4 md:p-4">
        <b className="text-[13px] font-bold text-ink">Your subscriptions</b>
        <ul>
          {subscriptions.map((sub) => (
            <li
              key={sub.id}
              className="flex items-center gap-3 border-b border-line py-[13px] last:border-0 last:pb-1"
            >
              <Avatar name={sub.holderName} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-ink">
                  {sub.holderType === 'self' ? 'You' : sub.holderName}
                </div>
                <div className="tabular mt-px text-xs text-muted">
                  {sub.shares.toLocaleString()} shares · {ngn(sub.amountPaid)}
                  {sub.payments > 1 ? ` · ${sub.payments} payments` : ''}
                </div>
              </div>
              <Link
                to={`/top-up/${sub.id}`}
                className="rounded-full bg-olive-soft px-3.5 py-[7px] text-xs font-bold text-olive-deep transition-colors hover:bg-olive-pale focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive"
              >
                Top up
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
