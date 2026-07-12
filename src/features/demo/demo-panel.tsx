import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Menu } from 'lucide-react';
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
  { key: 'prelive', label: '⏳ Offers — pre-live (waitlist)', scenario: 'prelive', to: '/offers' },
  {
    key: 'live',
    label: '🟢 Offers — live, not subscribed',
    scenario: 'live-fresh',
    to: '/offers',
  },
  {
    key: 'minor',
    label: '🧒 Subscribe for a minor',
    scenario: 'live-fresh',
    to: '/subscribe?for=minor',
  },
  {
    key: 'subscribed',
    label: '📈 Subscribed (top-up, history)',
    scenario: 'subscribed',
    to: '/offers',
  },
];

/**
 * The approved flow's floating presenter: "☰ Presenter" pill bottom-right
 * toggling a dark panel bottom-left. Demo aid only — not part of the product.
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
          'fixed bottom-[18px] right-[18px] z-[70] flex items-center gap-1.5 rounded-full border border-[#4A4E36] bg-[#1E2013] px-[18px] py-3',
          'text-[13px] font-bold text-stage-ink shadow-[0_8px_24px_rgb(0_0_0/0.45)]',
          'transition-colors hover:bg-[#282B1B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stage-accent',
        )}
      >
        <Menu className="size-4" aria-hidden />
        Presenter
      </button>

      <div
        id="demo-panel"
        role="dialog"
        aria-label="Presenter panel"
        className={cn(
          'fixed bottom-[74px] left-5 z-[80] max-h-[76vh] w-[290px] overflow-auto rounded-btn bg-[#1E2013] p-[18px] pb-3.5',
          'shadow-[0_20px_50px_rgb(0_0_0/0.5)] transition-all duration-200',
          open
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-4 scale-[0.98] opacity-0',
        )}
      >
        <h2 className="text-base font-bold text-stage-ink">
          Vetiva · Dangote IPO{' '}
          <span className="ml-1 rounded-full bg-[#3D402C] px-2 py-0.5 text-[10px] text-stage-accent">
            WEB DEMO
          </span>
        </h2>
        <p className="mb-4 mt-0.5 text-xs leading-relaxed text-stage-muted">
          Clickable prototype — web layout. All figures, fees and rates are placeholders marked
          [DEMO].
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

        <p className="mt-3 border-t border-stage-line pt-2.5 text-[11px] leading-relaxed text-[#8B8D74]">
          <b>Web layout:</b> before login, an inset image-slider card sits on the left with the form
          beside it. After login it's a dashboard — Home / Wallet / Offers / Products / Portfolio.
          Presenter panel is a demo aid, not part of the product. Ctrl+. toggles it.
        </p>
      </div>
    </>
  );
}

function PanelGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3.5">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8B8D74]">
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
