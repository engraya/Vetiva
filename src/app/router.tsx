import { createBrowserRouter, Outlet } from 'react-router';
import { AuthLayout } from '@/layouts/auth-layout';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { DemoPanel } from '@/features/demo/demo-panel';
import { RouteErrorPage } from '@/pages/errors/route-error';
import { NotFoundPage } from '@/pages/errors/not-found';
import { MaintenancePage } from '@/pages/errors/maintenance';

/** Mounts the presenter overlay on every screen, as in the approved flow. */
function RootLayout() {
  return (
    <>
      <Outlet />
      <DemoPanel />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            index: true,
            lazy: async () => {
              const { GetStartedPage } =
                await import('@/features/auth/components/get-started-page');
              return { Component: GetStartedPage };
            },
          },
          {
            path: 'auth/login',
            lazy: async () => {
              const { LoginPage } = await import('@/features/auth/components/login-page');
              return { Component: LoginPage };
            },
          },
          {
            path: 'auth/register',
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
              const { HomePage } = await import('@/features/home/components/home-page');
              return { Component: HomePage };
            },
          },
          {
            path: 'offers',
            lazy: async () => {
              const { OffersPage } = await import('@/features/offer/components/offers-page');
              return { Component: OffersPage };
            },
          },
          {
            path: 'wallet',
            lazy: async () => {
              const { WalletPage } = await import('@/features/wallet/components/wallet-page');
              return { Component: WalletPage };
            },
          },
          {
            path: 'portfolio',
            lazy: async () => {
              const { PortfolioPage } =
                await import('@/features/portfolio/components/portfolio-page');
              return { Component: PortfolioPage };
            },
          },
          {
            path: 'products',
            lazy: async () => {
              const { ProductsPage } = await import('@/features/products/components/products-page');
              return { Component: ProductsPage };
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
