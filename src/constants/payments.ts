import type { PaymentMethod } from '@/types/domain';

/** [DEMO] ₦ per $ — rate provided by Flutterwave in the prototype */
export const FX_RATE = 1470;

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'transfer',
    label: 'Bank transfer',
    icon: 'bank',
    feeLabel: 'No fee',
    feeRule: { type: 'flat', value: 0 },
    currency: 'NGN',
    cheapest: true,
  },
  {
    id: 'flw-ngn',
    label: 'Flutterwave · Card (NGN)',
    icon: 'card',
    feeLabel: '1.4% fee',
    feeRule: { type: 'percent', pct: 0.014 },
    currency: 'NGN',
  },
  {
    id: 'paystack',
    label: 'Paystack · Card (NGN)',
    icon: 'card',
    feeLabel: '1.5% + ₦100 fee',
    feeRule: { type: 'percentPlusFixed', pct: 0.015, fixed: 100 },
    currency: 'NGN',
  },
  {
    id: 'flw-usd',
    label: 'Flutterwave · Card (USD)',
    icon: 'globe',
    feeLabel: '3.8% + FX',
    feeRule: { type: 'percentFx', pct: 0.038, fxRate: FX_RATE },
    currency: 'USD',
  },
];
