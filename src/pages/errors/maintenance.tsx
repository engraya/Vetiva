import { Logo } from '@/components/common/logo';

export function MaintenancePage() {
  return (
    <div className="stage-gradient flex min-h-dvh flex-col items-center justify-center p-6 text-center">
      <Logo light className="text-xl" />
      <p className="mt-10 text-5xl" aria-hidden>
        🛠️
      </p>
      <h1 className="mt-4 text-lg font-bold text-stage-ink">We'll be right back</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-stage-muted">
        Vetiva IPO is briefly down for scheduled maintenance. Your subscriptions and funds are safe.
      </p>
    </div>
  );
}
