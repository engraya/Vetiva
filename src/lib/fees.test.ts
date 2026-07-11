import { describe, expect, it } from 'vitest';
import { calcFee, calcTotals } from './fees';
import { PAYMENT_METHODS, FX_RATE } from '@/constants/payments';
import { MIN_SHARES, PRICE_PER_SHARE } from '@/constants/offer';

function method(id: string) {
  const m = PAYMENT_METHODS.find((m) => m.id === id);
  if (!m) throw new Error(`unknown method ${id}`);
  return m;
}

describe('calcFee', () => {
  it('bank transfer is free', () => {
    expect(calcFee(method('transfer').feeRule, 122_750)).toBe(0);
  });

  it('Flutterwave NGN charges 1.4%', () => {
    expect(calcFee(method('flw-ngn').feeRule, 100_000)).toBeCloseTo(1_400);
  });

  it('Paystack charges 1.5% + ₦100', () => {
    expect(calcFee(method('paystack').feeRule, 100_000)).toBeCloseTo(1_600);
  });

  it('Flutterwave USD charges 3.8%', () => {
    expect(calcFee(method('flw-usd').feeRule, 100_000)).toBeCloseTo(3_800);
  });
});

describe('calcTotals', () => {
  it('computes the minimum-order transfer total (₦122,750, no fee)', () => {
    const t = calcTotals(method('transfer'), MIN_SHARES, PRICE_PER_SHARE);
    expect(t.amount).toBeCloseTo(122_750);
    expect(t.fee).toBe(0);
    expect(t.total).toBeCloseTo(122_750);
    expect(t.totalUsd).toBeUndefined();
  });

  it('converts USD totals at the FX rate', () => {
    const t = calcTotals(method('flw-usd'), MIN_SHARES, PRICE_PER_SHARE);
    expect(t.total).toBeCloseTo(122_750 * 1.038);
    expect(t.totalUsd).toBeCloseTo((122_750 * 1.038) / FX_RATE);
    expect(t.fxRate).toBe(FX_RATE);
  });
});
