import { describe, expect, it } from 'vitest';
import { ngn, usd } from './money';

describe('money formatting', () => {
  it('formats naira with 2 decimals and grouping', () => {
    expect(ngn(122_750)).toBe('₦122,750.00');
    expect(ngn(245.5)).toBe('₦245.50');
  });

  it('formats dollars with 2 decimals', () => {
    expect(usd(86.68)).toBe('$86.68');
    expect(usd(1_234.5)).toBe('$1,234.50');
  });
});
