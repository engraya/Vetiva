import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FlaskConical, X } from 'lucide-react';
import { DemoTag } from '@/components/common/demo-tag';
import { useAuthStore } from '@/features/auth/store';
import { DEMO_USER, seedScenario, type DemoScenario } from '@/mocks/db';
import { cn } from '@/lib/utils';

interface ScenarioAction {
  key: string;
  label: string;
  scenario: DemoScenario;
  /** Where to land after seeding */
  to: string;
  /** Clears the session (journeys that start logged-out) */
  logout?: boolean;
  toastMessage?: string;
}

const JOURNEYS: ScenarioAction[] = [
  { key: 'new', label: '🆕 New user — full journey', scenario: 'new-user', to: '/', logout: true },
  {
    key: 'returning',
    label: '🔁 Returning user — login',
    scenario: 'live-fresh',
    to: '/auth/login',
    logout: true,
  },
];

const STATES: ScenarioAction[] = [
  {
    key: 'prelive',
    label: '⏳ Pre-live landing (waitlist)',
    scenario: 'prelive',
    to: '/dashboard',
    toastMessage: 'Demo: offer switched to PRE-LIVE',
  },
  {
    key: 'live',
    label: '🟢 Live — not subscribed',
    scenario: 'live-fresh',
    to: '/dashboard',
    toastMessage: 'Demo: offer switched to LIVE',
  },
  {
    key: 'minor',
    label: '🧒 Subscribe for a minor',
    scenario: 'live-fresh',
    to: '/subscribe?for=minor',
  },
  {
    key: 'subscribed',
    label: '📈 Live — subscribed (top-up)',
    scenario: 'subscribed',
    to: '/dashboard',
    toastMessage: 'Demo: seeded an existing position',
  },
];

/**
 * The prototype's presenter rail, rebuilt as a floating scenario panel.
 * Toggle with the button or Ctrl+. — demo tooling, clearly badged.
 */
export function DemoPanel() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login, logout } = useAuthStore();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === '.') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function run(action: ScenarioAction) {
    seedScenario(action.scenario);
    if (action.logout) {
      logout();
    } else if (!useAuthStore.getState().isAuthenticated) {
      // State jumps assume a signed-in demo user
      login('demo-token-vetiva', DEMO_USER);
    }
    void queryClient.invalidateQueries();
    setOpen(false);
    if (action.toastMessage) toast(action.toastMessage);
    navigate(action.to);
  }

  function reset() {
    seedScenario('new-user');
    logout();
    void queryClient.invalidateQueries();
    setOpen(false);
    toast('Demo reset');
    navigate('/');
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="demo-panel"
        className={cn(
          'fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-[#4A4E36] bg-[#1E2013] px-4 py-3',
          'text-[13px] font-bold text-stage-ink shadow-[0_8px_24px_rgb(0_0_0/0.45)]',
          'transition-colors hover:bg-[#282B1B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stage-accent',
        )}
      >
        <FlaskConical className="size-4" aria-hidden />
        Demo scenarios
      </button>

      {open && (
        <div
          id="demo-panel"
          role="dialog"
          aria-label="Demo scenarios"
          className="fixed bottom-20 right-5 z-40 w-[300px] rounded-card border border-stage-line bg-[#1E2013] p-4 shadow-overlay"
          style={{ animation: 'menu-in 180ms var(--ease-screen)' }}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-stage-ink">
              Vetiva · Dangote IPO{' '}
              <DemoTag className="ml-1 border-stage-line bg-stage-card text-stage-accent" />
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close demo panel"
              className="rounded-md p-1 text-stage-muted hover:text-stage-ink"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-stage-muted">
            Clickable prototype — all figures are placeholders. Ctrl+. toggles this panel.
          </p>

          <PanelGroup label="Journeys">
            {JOURNEYS.map((action) => (
              <PanelButton key={action.key} onClick={() => run(action)}>
                {action.label}
              </PanelButton>
            ))}
          </PanelGroup>

          <PanelGroup label="Jump to state">
            {STATES.map((action) => (
              <PanelButton key={action.key} onClick={() => run(action)}>
                {action.label}
              </PanelButton>
            ))}
          </PanelGroup>

          <PanelGroup label="Controls">
            <PanelButton onClick={reset}>♻️ Reset demo</PanelButton>
          </PanelGroup>
        </div>
      )}
    </>
  );
}

function PanelGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8B8D74]">
        {label}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function PanelButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full rounded-[10px] border border-stage-line bg-stage-card px-3 py-2.5 text-left text-[13px] text-stage-ink transition-colors hover:bg-[#383C29] focus-visible:outline-2 focus-visible:outline-stage-accent"
    >
      {children}
    </button>
  );
}
