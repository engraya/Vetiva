import { toast } from 'sonner';
import { ArrowUpRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BalanceCard } from '@/components/common/balance-card';
import { EmptyState } from '@/components/common/empty-state';
import { PageTransition } from '@/components/common/page-transition';
import { useTransactions } from '@/features/wallet/api';
import { OFFER_TICKER } from '@/constants/offer';
import { ngn } from '@/lib/money';

export function WalletPage() {
  const { data: transactions, isPending } = useTransactions();

  return (
    <PageTransition>
      <div className="max-w-[420px]">
        <BalanceCard label="Wallet balance" value="₦0.00">
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              onClick={() => toast('Add money — wallet funding is out of scope for this demo')}
            >
              <Plus className="size-3.5" aria-hidden /> Add Money
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toast('Withdraw — out of scope for this demo')}
            >
              <ArrowUpRight className="size-3.5" aria-hidden /> Withdraw
            </Button>
          </div>
        </BalanceCard>
      </div>

      <h3 className="mb-3 mt-[26px] text-base font-bold text-ink">Recent Transactions</h3>
      {isPending ? (
        <Skeleton className="h-40 max-w-[720px] rounded-card" />
      ) : transactions && transactions.length > 0 ? (
        <Card className="max-w-[720px] p-4 md:p-5">
          <ul>
            {transactions.map((txn) => (
              <li
                key={txn.id}
                className="flex items-start justify-between gap-4 border-b border-line py-2.5 text-sm last:border-0"
              >
                <span className="min-w-0">
                  <span className="block text-muted">{txn.label}</span>
                  <span className="mt-0.5 block text-xs text-muted/80">{txn.when}</span>
                </span>
                <span className="tabular font-semibold text-ink">{ngn(txn.amount)}</span>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <EmptyState icon="🗓️">
          You do not have any transactions yet.
          <br />
          Subscribe to the {OFFER_TICKER} IPO to get started.
        </EmptyState>
      )}
    </PageTransition>
  );
}
