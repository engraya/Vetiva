import { Navigate, Outlet, useLocation } from 'react-router';
import { HeroSlider } from '@/components/common/hero-slider';
import { useAuthStore } from '@/features/auth/store';

/**
 * Pre-login shell per the approved web flow: white page, inset rounded
 * image-slider card on the left (~1/3), form centered in the open space
 * to its right. Below lg the slider is hidden and the form fills the
 * screen. Authenticated users are bounced into the app.
 */
export function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from ?? '/dashboard'} replace />;
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-white">
      <HeroSlider className="hidden lg:block" />
      <main className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-6 lg:px-6 lg:py-10">
        <div className="w-full max-w-[470px] self-center">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
