import { Calculator } from 'lucide-react';
import { QuantityStepper, QuickPicks } from '@/components/common/quantity-stepper';
import { QUICK_PICKS } from '@/constants/offer';
import { qtyStep } from '@/lib/shares';
import { ngn } from '@/lib/money';
import { Section } from './section';

interface SharesSectionProps {
  step?: number;
  title: string;
  value: number;
  floor: number;
  price: number;
  showMinimum?: number;
  onChange: (shares: number) => void;
}

export function SharesSection({
  step,
  title,
  value,
  floor,
  price,
  showMinimum,
  onChange,
}: SharesSectionProps) {
  return (
    <Section
      step={step}
      icon={<Calculator className="size-[18px]" aria-hidden />}
      title={title}
      description={
        <>
          {showMinimum !== undefined && `Minimum ${showMinimum.toLocaleString()} shares. `}
          Enter any quantity — it rounds to the nearest {qtyStep(value).toLocaleString()} shares.
        </>
      }
    >
      <QuantityStepper value={value} floor={floor} onChange={onChange} />
      <QuickPicks picks={QUICK_PICKS} value={value} onPick={onChange} />
      <div className="mt-3 flex items-center justify-between rounded-input bg-olive-soft px-3.5 py-3 text-sm">
        <span className="tabular text-ink">
          {value.toLocaleString()} shares × {ngn(price)}
        </span>
        <strong className="tabular text-base font-bold text-ink">{ngn(value * price)}</strong>
      </div>
    </Section>
  );
}
