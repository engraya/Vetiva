/**
 * Share-quantity rules from the offer terms:
 * quantities round to the nearest 100 shares below 10,000,
 * and to the nearest 1,000 at/above 10,000.
 */
export const STEP_BREAKPOINT = 10_000;
export const SMALL_STEP = 100;
export const LARGE_STEP = 1_000;

export function qtyStep(shares: number): number {
  return shares >= STEP_BREAKPOINT ? LARGE_STEP : SMALL_STEP;
}

/** Round to the nearest valid step, clamped to a floor. */
export function roundQty(shares: number, floor: number): number {
  const step = qtyStep(shares);
  const rounded = Math.round(shares / step) * step;
  return Math.max(floor, rounded);
}

/**
 * Minimum shares derives from the minimum investment ÷ price, rounded UP to a
 * valid step — it follows the price rather than being a fixed number.
 */
export function deriveMinShares(minAmount: number, pricePerShare: number): number {
  const raw = Math.ceil(minAmount / pricePerShare);
  const step = qtyStep(raw);
  return Math.ceil(raw / step) * step;
}
