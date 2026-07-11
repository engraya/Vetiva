import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuthStore } from './store';
import type {
  AuthResponse,
  BvnLookupRequest,
  BvnLookupResponse,
  LoginRequest,
  OtpSendRequest,
  OtpSendResponse,
  OtpVerifyRequest,
  OtpVerifyResponse,
  RegisterRequest,
} from '@/types/api';

export function useBvnLookup() {
  return useMutation({
    mutationFn: async (body: BvnLookupRequest) =>
      (await api.post<BvnLookupResponse>('/auth/bvn-lookup', body)).data,
  });
}

export function useSendOtp() {
  return useMutation({
    mutationFn: async (body: OtpSendRequest) =>
      (await api.post<OtpSendResponse>('/auth/otp/send', body)).data,
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: async (body: OtpVerifyRequest) =>
      (await api.post<OtpVerifyResponse>('/auth/otp/verify', body)).data,
  });
}

export function useRegister() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: async (body: RegisterRequest) =>
      (await api.post<AuthResponse>('/auth/register', body)).data,
    onSuccess: ({ token, user }) => login(token, user),
  });
}

export function useLogin() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: async (body: LoginRequest) =>
      (await api.post<AuthResponse>('/auth/login', body)).data,
    onSuccess: ({ token, user }) => login(token, user),
  });
}
