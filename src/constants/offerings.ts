import type { OfferingSummary } from '@/types/domain';

/** [DEMO] other Vetiva offerings shown while an IPO is pending */
export const OTHER_OFFERINGS: OfferingSummary[] = [
  {
    id: 'vmmf',
    name: 'Vetiva Money Market Fund',
    description: 'Low-risk fund, quarterly income',
    yieldLabel: '18.2% p.a.',
  },
  {
    id: 'griffin-30',
    name: 'Vetiva Griffin 30 ETF',
    description: 'Tracks the NGX 30 index',
    yieldLabel: '+24.6% YTD',
  },
  {
    id: 'dollar-fund',
    name: 'Dollar Fund',
    description: 'USD-denominated fixed income',
    yieldLabel: '6.1% p.a.',
  },
];
