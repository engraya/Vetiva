import { createBrowserRouter } from 'react-router';
import { AuthLayout } from '@/layouts/auth-layout';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { RouteErrorPage } from '@/pages/errors/route-error';
import { NotFoundPage } from '@/pages/errors/not-found';
import { MaintenancePage } from '@/pages/errors/maintenance';

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { LandingPage } = await import('@/features/auth/components/landing-page');
          return { Component: LandingPage };
        },
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            lazy: async () => {
              const { LoginPage } = await import('@/features/auth/components/login-page');
              return { Component: LoginPage };
            },
          },
          {
            path: 'register',
            lazy: async () => {
              const { RegisterPage } = await import('@/features/auth/components/register-page');
              return { Component: RegisterPage };
            },
          },
        ],
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: 'dashboard',
            lazy: async () => {
              const { DashboardPage } = await import('@/features/offer/components/dashboard-page');
              return { Component: DashboardPage };
            },
          },
          {
            path: 'subscribe',
            lazy: async () => {
              const { SubscribePage } =
                await import('@/features/subscription/components/subscribe-page');
              return { Component: SubscribePage };
            },
          },
          {
            path: 'top-up/:accountId',
            lazy: async () => {
              const { TopUpPage } = await import('@/features/subscription/components/top-up-page');
              return { Component: TopUpPage };
            },
          },
          {
            path: 'subscription/success',
            lazy: async () => {
              const { SuccessPage } =
                await import('@/features/subscription/components/success-page');
              return { Component: SuccessPage };
            },
          },
          {
            path: 'profile',
            lazy: async () => {
              const { ProfilePage } = await import('@/features/profile/components/profile-page');
              return { Component: ProfilePage };
            },
          },
        ],
      },
      { path: 'maintenance', element: <MaintenancePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
