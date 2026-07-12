import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { PageTransition } from '@/components/common/page-transition';
import { useLogin } from '@/features/auth/api';
import { loginSchema, type LoginValues } from '@/features/auth/schemas';
import { api, apiErrorMessage } from '@/lib/axios';
import { DEMO_USER } from '@/mocks/db';
import type { Subscription } from '@/types/domain';

function RequiredMark() {
  return (
    <span className="text-bad" aria-hidden>
      {' '}
      *
    </span>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: DEMO_USER.email, password: 'Demo1234' },
  });

  function onSubmit(values: LoginValues) {
    login.mutate(values, {
      onSuccess: async () => {
        toast.success('Logged in');
        const from = (location.state as { from?: string } | null)?.from;
        if (from) {
          navigate(from, { replace: true });
          return;
        }
        // Approved flow: land on Home when there's a position, else on Offers
        let hasPosition = false;
        try {
          const { data } = await api.get<Subscription[]>('/subscriptions');
          hasPosition = data.length > 0;
        } catch {
          // fall through to Offers
        }
        navigate(hasPosition ? '/dashboard' : '/offers', { replace: true });
      },
      onError: (error) => toast.error(apiErrorMessage(error)),
    });
  }

  return (
    <PageTransition>
      <h1 className="text-[32px] font-bold tracking-[-0.025em] text-ink">Welcome Back</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Field
          label={
            <>
              Email
              <RequiredMark />
            </>
          }
          error={form.formState.errors.email?.message}
        >
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              type="email"
              autoComplete="email"
              placeholder="Enter your email address"
              aria-describedby={describedBy}
              invalid={!!form.formState.errors.email}
              {...form.register('email')}
            />
          )}
        </Field>

        <Field
          label={
            <>
              Password
              <RequiredMark />
            </>
          }
          error={form.formState.errors.password?.message}
        >
          {({ inputId, describedBy }) => (
            <PasswordInput
              id={inputId}
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-describedby={describedBy}
              invalid={!!form.formState.errors.password}
              {...form.register('password')}
            />
          )}
        </Field>

        <Button
          type="button"
          variant="link"
          size="bare"
          className="mt-3 font-bold"
          onClick={() => toast('Password reset flow — out of scope for this demo')}
        >
          Forgot Password?
        </Button>

        <Button type="submit" size="lg" className="mt-5" loading={login.isPending}>
          Login
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        Don't have an account?{' '}
        <Link to="/" className="font-bold text-olive-deep underline-offset-2 hover:underline">
          Create an account
        </Link>
      </p>

      <p className="mt-6 text-center text-xs leading-relaxed text-muted">
        © 2026 Vetiva Capital Management Limited
        <br />
        All Rights Reserved
      </p>
    </PageTransition>
  );
}
