import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/features/auth/store';
import type { User } from '@/types/domain';
import type { UpdatePhoneRequest, VerifyPhoneRequest } from '@/types/api';

export const profileKeys = {
  me: ['me'] as const,
};

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: profileKeys.me,
    queryFn: async () => (await api.get<User>('/me')).data,
    enabled: isAuthenticated,
  });
}

export function useUpdatePhone() {
  return useMutation({
    mutationFn: async (body: UpdatePhoneRequest) =>
      (await api.patch<{ otpSent: boolean }>('/me/phone', body)).data,
  });
}

export function useVerifyPhone() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: async (body: VerifyPhoneRequest) =>
      (await api.post<User>('/me/phone/verify', body)).data,
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(profileKeys.me, user);
    },
  });
}
