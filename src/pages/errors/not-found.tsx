import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/logo';

export function NotFoundPage() {
  return (
    <div className="stage-gradient flex min-h-dvh flex-col items-center justify-center p-6 text-center">
      <Logo light className="text-xl" />
      <p className="mt-10 text-7xl font-extrabold tracking-tight text-stage-ink">404</p>
      <h1 className="mt-3 text-lg font-bold text-stage-ink">This page doesn't exist</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-stage-muted">
        The page you're looking for may have moved, or the link is broken.
      </p>
      <Button asChild variant="ghost" size="md" className="mt-8">
        <Link to="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
