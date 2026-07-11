import { deriveMinShares } from '@/lib/shares';

/** [DEMO] — all offer figures are placeholders from the prototype */
export const OFFER_ID = 'dprp-2026';

export const OFFER_NAME = 'Dangote Petroleum Refinery & Petrochemicals';
export const OFFER_TICKER = 'DPRP';
export const PRICE_PER_SHARE = 245.5;
export const MIN_AMOUNT = 100_000;
export const MIN_SHARES = deriveMinShares(MIN_AMOUNT, PRICE_PER_SHARE);

export const OPENS_AT = '2026-07-10T09:00:00+01:00';
export const CLOSES_AT = '2026-07-31T17:00:00+01:00';
export const ALLOTMENT_EXPECTED_AT = '2026-08-08T00:00:00+01:00';

export const QUICK_PICKS = [500, 1000, 5000, 10000] as const;

/** Top-ups have no offer minimum — floor is one rounding step */
export const TOPUP_MIN_SHARES = 100;
