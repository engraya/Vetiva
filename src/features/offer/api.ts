import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Offer, OfferingSummary, PaymentMethod } from '@/types/domain';
import type { Paginated, WaitlistRequest, WaitlistResponse } from '@/types/api';

export const offerKeys = {
  current: ['offer', 'current'] as const,
  offerings: ['offerings'] as const,
  waitlist: ['waitlist'] as const,
  paymentMethods: ['payment-methods'] as const,
};

export function useOffer() {
  return useQuery({
    queryKey: offerKeys.current,
    queryFn: async () => (await api.get<Offer>('/offers/current')).data,
  });
}

export function useOfferings() {
  return useQuery({
    queryKey: offerKeys.offerings,
    queryFn: async () => (await api.get<Paginated<OfferingSummary>>('/offers')).data.items,
  });
}

export function useWaitlistStatus() {
  return useQuery({
    queryKey: offerKeys.waitlist,
    queryFn: async () => (await api.get<{ joined: boolean }>('/waitlist/status')).data,
  });
}

export function useJoinWaitlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: WaitlistRequest) =>
      (await api.post<WaitlistResponse>('/waitlist', body)).data,
    onSuccess: () => {
      queryClient.setQueryData(offerKeys.waitlist, { joined: true });
    },
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: offerKeys.paymentMethods,
    queryFn: async () => (await api.get<PaymentMethod[]>('/payments/methods')).data,
    staleTime: Infinity,
  });
}
