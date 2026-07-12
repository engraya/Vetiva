import { Navigate, Outlet, useLocation } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import { BottomTabBar, Sidebar } from './sidebar';
import { AppHeader } from './app-header';
import { useAuthStore } from '@/features/auth/store';

/**
 * Post-login shell per the approved web flow: white 232px sidebar on
 * desktop, bottom tab bar below lg, "Welcome" header, scrollable main
 * with a 1080px content column.
 */
export function DashboardLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-input focus:bg-stage focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-stage-ink"
      >
        Skip to content
      </a>

      <aside className="hidden w-[232px] shrink-0 border-r border-line bg-white lg:block">
        <Sidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto px-4 pb-28 pt-5 md:px-[34px] md:pb-[60px] md:pt-6"
        >
          <div className="max-w-[1080px]">
            <AnimatePresence mode="wait">
              <Outlet key={location.pathname} />
            </AnimatePresence>
          </div>
        </main>
      </div>

      <BottomTabBar />
    </div>
  );
}
