import type { FeeRule, PaymentMethod } from '@/types/domain';

/** Fee charged on top of the subscription amount, in NGN. */
export function calcFee(rule: FeeRule, amount: number): number {
  switch (rule.type) {
    case 'flat':
      return rule.value;
    case 'percent':
      return amount * rule.pct;
    case 'percentPlusFixed':
      return amount * rule.pct + rule.fixed;
    case 'percentFx':
      return amount * rule.pct;
  }
}

export interface OrderTotals {
  amount: number;
  fee: number;
  total: number;
  /** Present for USD methods: total converted at the method's FX rate */
  totalUsd?: number;
  fxRate?: number;
}

export function calcTotals(method: PaymentMethod, shares: number, price: number): OrderTotals {
  const amount = shares * price;
  const fee = calcFee(method.feeRule, amount);
  const total = amount + fee;
  if (method.feeRule.type === 'percentFx') {
    return {
      amount,
      fee,
      total,
      totalUsd: total / method.feeRule.fxRate,
      fxRate: method.feeRule.fxRate,
    };
  }
  return { amount, fee, total };
}
