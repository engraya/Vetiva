export type AccountType = 'individual' | 'corporate';

export type OfferStatus = 'upcoming' | 'live' | 'closed';

export interface Offer {
  id: string;
  name: string;
  ticker: string;
  status: OfferStatus;
  pricePerShare: number;
  minAmount: number;
  minShares: number;
  opensAt: string;
  closesAt: string;
  allotmentExpectedAt: string;
  prospectusUrl: string;
}

export interface OfferingSummary {
  id: string;
  name: string;
  description: string;
  yieldLabel: string;
}

export interface User {
  id: string;
  name: string;
  firstName: string;
  email: string;
  phone: string;
  dob: string;
  bankName: string;
  bankAccount: string;
  accountType: AccountType;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export type HolderType = 'self' | 'minor';

export interface Subscription {
  id: string;
  holderType: HolderType;
  holderName: string;
  /** Present when holderType === 'minor' */
  minor?: { name: string; dob: string; nin: string };
  cscs: string;
  shares: number;
  amountPaid: number;
  payments: number;
}

export type FeeRule =
  | { type: 'flat'; value: number }
  | { type: 'percent'; pct: number }
  | { type: 'percentPlusFixed'; pct: number; fixed: number }
  | { type: 'percentFx'; pct: number; fxRate: number };

export interface PaymentMethod {
  id: string;
  label: string;
  icon: 'bank' | 'card' | 'globe';
  feeLabel: string;
  feeRule: FeeRule;
  currency: 'NGN' | 'USD';
  cheapest?: boolean;
}

export interface Bank {
  code: string;
  name: string;
}

export interface Transaction {
  id: string;
  label: string;
  amount: number;
  when: string;
}

export interface Order {
  id: string;
  kind: 'subscription' | 'topup';
  subscriptionId: string;
  holderType: HolderType;
  holderName: string;
  minorName?: string;
  shares: number;
  amount: number;
  fee: number;
  total: number;
  paymentMethodId: string;
  cscs: string;
  /** Totals for the subscription after this order */
  positionShares: number;
  positionPaid: number;
  positionPayments: number;
}
