import { describe, expect, it } from 'vitest';
import { deriveMinShares, qtyStep, roundQty } from './shares';

describe('qtyStep', () => {
  it('uses 100-share steps below 10,000', () => {
    expect(qtyStep(100)).toBe(100);
    expect(qtyStep(9_900)).toBe(100);
  });

  it('uses 1,000-share steps at/above 10,000', () => {
    expect(qtyStep(10_000)).toBe(1_000);
    expect(qtyStep(50_000)).toBe(1_000);
  });
});

describe('roundQty', () => {
  it('rounds to the nearest 100 below the breakpoint', () => {
    expect(roundQty(149, 100)).toBe(100);
    expect(roundQty(150, 100)).toBe(200);
    expect(roundQty(9_949, 100)).toBe(9_900);
  });

  it('rounds to the nearest 1,000 at/above the breakpoint', () => {
    expect(roundQty(10_000, 100)).toBe(10_000);
    expect(roundQty(10_499, 100)).toBe(10_000);
    expect(roundQty(10_500, 100)).toBe(11_000);
  });

  it('clamps to the floor', () => {
    expect(roundQty(0, 500)).toBe(500);
    expect(roundQty(-200, 100)).toBe(100);
    expect(roundQty(400, 500)).toBe(500);
  });
});

describe('deriveMinShares', () => {
  it('derives 500 shares for ₦100,000 at ₦245.50/share (offer terms)', () => {
    // ceil(100000 / 245.50) = 408 → step 100 → ceil to 500
    expect(deriveMinShares(100_000, 245.5)).toBe(500);
  });

  it('follows the price rather than being fixed', () => {
    expect(deriveMinShares(100_000, 100)).toBe(1_000);
    expect(deriveMinShares(100_000, 9.5)).toBe(11_000); // crosses the 10k breakpoint
  });
});
