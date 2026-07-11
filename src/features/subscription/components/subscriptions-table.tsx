import { Link } from 'react-router';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ngn } from '@/lib/money';
import type { Subscription } from '@/types/domain';

/** Desktop table of holdings; stacks into cards below md. */
export function SubscriptionsTable({ subscriptions }: { subscriptions: Subscription[] }) {
  return (
    <Card className="mt-6">
      <h3 className="text-[15px] font-bold text-ink">Your subscriptions</h3>

      {/* Table ≥ md */}
      <div className="mt-2 hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Holder</TableHead>
              <TableHead>CSCS account</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Invested</TableHead>
              <TableHead className="text-right">Payments</TableHead>
              <TableHead className="sr-only">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>
                  <span className="flex items-center gap-3">
                    <Avatar name={sub.holderName} />
                    <span>
                      <span className="block text-sm font-bold text-ink">
                        {sub.holderType === 'self' ? 'You' : sub.holderName}
                      </span>
                      {sub.holderType === 'minor' && (
                        <Badge variant="guardian" className="mt-0.5">
                          Minor · guardian: you
                        </Badge>
                      )}
                    </span>
                  </span>
                </TableCell>
                <TableCell className="tabular text-sm text-muted">{sub.cscs}</TableCell>
                <TableCell className="tabular text-right text-sm font-semibold">
                  {sub.shares.toLocaleString()}
                </TableCell>
                <TableCell className="tabular text-right text-sm font-semibold">
                  {ngn(sub.amountPaid)}
                </TableCell>
                <TableCell className="tabular text-right text-sm text-muted">
                  {sub.payments}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="soft" size="pill">
                    <Link to={`/top-up/${sub.id}`}>Top up</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Card list < md */}
      <ul className="mt-1 md:hidden">
        {subscriptions.map((sub) => (
          <li
            key={sub.id}
            className="flex items-center gap-3 border-b border-line py-3.5 last:border-0"
          >
            <Avatar name={sub.holderName} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-ink">
                {sub.holderType === 'self' ? 'You' : sub.holderName}
              </div>
              <div className="tabular mt-0.5 text-xs text-muted">
                {sub.shares.toLocaleString()} shares · {ngn(sub.amountPaid)}
                {sub.payments > 1 ? ` · ${sub.payments} payments` : ''}
              </div>
            </div>
            <Button asChild variant="soft" size="pill">
              <Link to={`/top-up/${sub.id}`}>Top up</Link>
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
