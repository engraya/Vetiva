import { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Sidebar } from './sidebar';
import { AppHeader } from './app-header';
import { DemoPanel } from '@/features/demo/demo-panel';
import { useAuthStore } from '@/features/auth/store';

/** Protected app shell: fixed sidebar ≥ lg, slide-over drawer below. */
export function DashboardLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="min-h-dvh bg-cream lg:pl-[264px]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-input focus:bg-stage focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-stage-ink"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="stage-gradient fixed inset-y-0 left-0 z-40 hidden w-[264px] lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {navOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setNavOpen(false)}
            className="absolute inset-0 bg-[rgb(20_21_12/0.45)]"
          />
          <div className="stage-gradient absolute inset-y-0 left-0 w-[280px] shadow-overlay">
            <button
              type="button"
              onClick={() => setNavOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-4 rounded-md p-1.5 text-stage-muted hover:text-stage-ink"
            >
              <X className="size-5" aria-hidden />
            </button>
            <Sidebar onNavigate={() => setNavOpen(false)} />
          </div>
        </div>
      )}

      <AppHeader onOpenNav={() => setNavOpen(true)} />

      <main id="main-content" className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-8 md:py-8">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>

      <DemoPanel />
    </div>
  );
}
