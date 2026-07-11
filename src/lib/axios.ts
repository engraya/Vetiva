import type { AxiosError } from 'axios';
import axios from 'axios';
import type { ApiError } from '@/types/api';
import { useAuthStore } from '@/features/auth/store';

export const api = axios.create({
  baseURL: '/api/v1',
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

/** Extract the server's ApiError message when present, else a generic one. */
export function apiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return 'Something went wrong. Please try again.';
}
