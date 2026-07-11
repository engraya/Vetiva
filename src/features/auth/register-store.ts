import { create } from 'zustand';
import type { AccountType } from '@/types/domain';
import type { BvnLookupResponse } from '@/types/api';

/** Cross-step wizard state; deliberately in-memory only. */
interface RegisterState {
  accountType: AccountType;
  bvn: string;
  identity: BvnLookupResponse | null;
  email: string;
  setAccountType: (t: AccountType) => void;
  setBvnResult: (bvn: string, identity: BvnLookupResponse) => void;
  setEmail: (email: string) => void;
  reset: () => void;
}

export const useRegisterStore = create<RegisterState>((set) => ({
  accountType: 'individual',
  bvn: '',
  identity: null,
  email: '',
  setAccountType: (accountType) => set({ accountType }),
  setBvnResult: (bvn, identity) => set({ bvn, identity, email: identity.email }),
  setEmail: (email) => set({ email }),
  reset: () => set({ bvn: '', identity: null, email: '' }),
}));
