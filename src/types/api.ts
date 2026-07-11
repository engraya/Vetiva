import type { AccountType, HolderType, User } from './domain';

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

/* ----- auth ----- */
export interface BvnLookupRequest {
  bvn: string;
}
export interface BvnLookupResponse {
  name: string;
  dob: string;
  phone: string;
  email: string;
}

export interface OtpSendRequest {
  channel: 'email' | 'sms';
  destination: string;
}
export interface OtpSendResponse {
  sent: boolean;
  expiresIn: number;
}

export interface OtpVerifyRequest {
  destination: string;
  code: string;
}
export interface OtpVerifyResponse {
  verified: boolean;
}

export interface RegisterRequest {
  bvn: string;
  email: string;
  password: string;
  accountType: AccountType;
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface AuthResponse {
  token: string;
  user: User;
}

/* ----- profile ----- */
export interface UpdatePhoneRequest {
  phone: string;
}
export interface VerifyPhoneRequest {
  code: string;
}

/* ----- offer ----- */
export interface WaitlistRequest {
  offerId: string;
  channel: 'email' | 'whatsapp';
}
export interface WaitlistResponse {
  joined: boolean;
}

/* ----- verification services ----- */
export interface CscsVerifyRequest {
  number: string;
  holder: HolderType;
  nin?: string;
}
export interface CscsVerifyResponse {
  valid: boolean;
  holderName: string;
}
export interface CscsCreateRequest {
  holder: HolderType;
  nin?: string;
}
export interface CscsCreateResponse {
  requestId: string;
  status: 'processing';
  /** Assigned number, exposed for the demo so orders can reference it */
  number: string;
}

export interface NinVerifyRequest {
  nin: string;
}
export interface NinVerifyResponse {
  name: string;
  dob: string;
  ninMasked: string;
}

export interface BankResolveRequest {
  bankCode: string;
  accountNumber: string;
}
export interface BankResolveResponse {
  accountName: string;
}

/* ----- orders ----- */
export interface DividendAccount {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface CreateSubscriptionRequest {
  offerId: string;
  holder: HolderType;
  minorNin?: string;
  shares: number;
  cscs: string;
  dividendAccount: DividendAccount | 'guardian';
  paymentMethodId: string;
  invitationCode?: string;
}

export interface TopUpRequest {
  shares: number;
  paymentMethodId: string;
}
