import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Bank, Order, Subscription } from '@/types/domain';
import type {
  BankResolveRequest,
  BankResolveResponse,
  CreateSubscriptionRequest,
  CscsCreateRequest,
  CscsCreateResponse,
  CscsVerifyRequest,
  CscsVerifyResponse,
  NinVerifyRequest,
  NinVerifyResponse,
  TopUpRequest,
} from '@/types/api';

export const subscriptionKeys = {
  list: ['subscriptions'] as const,
  banks: ['banks'] as const,
};

export function useSubscriptions() {
  return useQuery({
    queryKey: subscriptionKeys.list,
    queryFn: async () => (await api.get<Subscription[]>('/subscriptions')).data,
  });
}

export function useBanks() {
  return useQuery({
    queryKey: subscriptionKeys.banks,
    queryFn: async () => (await api.get<Bank[]>('/banks')).data,
    staleTime: Infinity,
  });
}

export function useVerifyCscs() {
  return useMutation({
    mutationFn: async (body: CscsVerifyRequest) =>
      (await api.post<CscsVerifyResponse>('/cscs/verify', body)).data,
  });
}

export function useCreateCscs() {
  return useMutation({
    mutationFn: async (body: CscsCreateRequest) =>
      (await api.post<CscsCreateResponse>('/cscs/create', body)).data,
  });
}

export function useVerifyNin() {
  return useMutation({
    mutationFn: async (body: NinVerifyRequest) =>
      (await api.post<NinVerifyResponse>('/nin/verify', body)).data,
  });
}

export function useResolveBank() {
  return useMutation({
    mutationFn: async (body: BankResolveRequest) =>
      (await api.post<BankResolveResponse>('/banks/resolve', body)).data,
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateSubscriptionRequest) =>
      (await api.post<Order>('/subscriptions', body)).data,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.list });
    },
  });
}

export function useTopUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: TopUpRequest & { id: string }) =>
      (await api.post<Order>(`/subscriptions/${id}/top-up`, body)).data,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.list });
    },
  });
}
