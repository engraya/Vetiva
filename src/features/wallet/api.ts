import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Transaction } from '@/types/domain';

export const walletKeys = {
  transactions: ['transactions'] as const,
};

export function useTransactions() {
  return useQuery({
    queryKey: walletKeys.transactions,
    queryFn: async () => (await api.get<Transaction[]>('/transactions')).data,
  });
}
