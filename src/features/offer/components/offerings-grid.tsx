import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DemoTag } from '@/components/common/demo-tag';
import { useOfferings } from '@/features/offer/api';

/** "While you wait" cross-sell — the mobile rail as a desktop 3-up grid. */
export function OfferingsGrid() {
  const { data: offerings, isPending } = useOfferings();

  return (
    <section aria-labelledby="offerings-heading" className="mt-8">
      <h3 id="offerings-heading" className="text-[15px] font-bold text-ink">
        While you wait — other offerings
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {isPending &&
          Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-28 rounded-card" />)}
        {offerings?.map((offering) => (
          <Card
            key={offering.id}
            className="p-4 transition-shadow duration-150 hover:shadow-e1 md:p-4"
          >
            <div className="text-sm font-bold text-ink">{offering.name}</div>
            <div className="mt-1 text-xs leading-relaxed text-muted">{offering.description}</div>
            <div className="mt-2.5 text-[13px] font-bold text-olive-deep">
              {offering.yieldLabel} <DemoTag />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
