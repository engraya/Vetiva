import { Link, isRouteErrorResponse, useRouteError } from 'react-router';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/logo';
import { NotFoundPage } from './not-found';

/** Root error boundary: 404s render the branded not-found page, the rest a 500. */
export function RouteErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  return (
    <div className="stage-gradient flex min-h-dvh flex-col items-center justify-center p-6 text-center">
      <Logo light className="text-xl" />
      <p className="mt-10 text-7xl font-extrabold tracking-tight text-stage-ink">500</p>
      <h1 className="mt-3 text-lg font-bold text-stage-ink">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-stage-muted">
        An unexpected error occurred. Your subscriptions and payments are unaffected.
      </p>
      <div className="mt-8 flex gap-3">
        <Button variant="ghost" size="md" onClick={() => window.location.reload()}>
          Reload
        </Button>
        <Button asChild variant="primary" size="md">
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
