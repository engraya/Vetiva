import { Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, SummaryRow } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar } from '@/components/ui/avatar';
import { PageTransition } from '@/components/common/page-transition';
import { useMe } from '@/features/profile/api';
import { formatDate } from '@/lib/utils';
import { PhoneVerification } from './phone-verification';

export function ProfilePage() {
  const { data: me, isPending } = useMe();

  if (isPending || !me) {
    return (
      <div className="mx-auto max-w-[640px] space-y-4">
        <Skeleton className="h-44 rounded-card" />
        <Skeleton className="h-64 rounded-card" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-[640px]">
        <h1 className="text-2xl font-bold tracking-[-0.025em] text-ink">
          Profile &amp; contact details
        </h1>

        <Card className="mt-5">
          <div className="flex items-center gap-4">
            <Avatar name={me.name} className="size-14 text-base" />
            <div>
              <div className="text-lg font-bold text-ink">{me.name}</div>
              <div className="text-sm capitalize text-muted">{me.accountType} account</div>
            </div>
          </div>
          <div className="mt-4 border-t border-line pt-2">
            <SummaryRow label="Full name" value={me.name} />
            <SummaryRow label="Date of birth" value={formatDate(me.dob)} />
            <SummaryRow
              label="Email"
              value={
                <span className="flex items-center gap-2">
                  {me.email}
                  <Badge variant="verified">✓ Verified</Badge>
                </span>
              }
            />
          </div>
        </Card>

        <Card className="mt-4">
          <div className="flex items-center gap-2.5">
            <Smartphone className="size-[18px] text-olive-deep" aria-hidden />
            <h2 className="text-[15px] font-bold text-ink">Phone number</h2>
            {me.phoneVerified ? (
              <Badge variant="verified">✓ Verified</Badge>
            ) : (
              <Badge variant="soon">Unverified</Badge>
            )}
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
            Keep your phone number verified so you don't miss communications from us — allotment
            updates, payment confirmations, and offer news. You can update your phone number here at
            any time.
          </p>
          <PhoneVerification user={me} />
        </Card>
      </div>
    </PageTransition>
  );
}
