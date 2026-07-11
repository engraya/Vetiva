import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { CheckboxLine } from '@/components/ui/checkbox';
import { DemoTag } from '@/components/common/demo-tag';
import { PageTransition } from '@/components/common/page-transition';
import { useLogin } from '@/features/auth/api';
import { loginSchema, type LoginValues } from '@/features/auth/schemas';
import { apiErrorMessage } from '@/lib/axios';
import { DEMO_USER } from '@/mocks/db';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: DEMO_USER.email, password: 'Demo1234', biometric: true },
  });

  function onSubmit(values: LoginValues) {
    login.mutate(values, {
      onSuccess: () => {
        toast.success('Logged in');
        const from = (location.state as { from?: string } | null)?.from;
        navigate(from ?? '/dashboard', { replace: true });
      },
      onError: (error) => toast.error(apiErrorMessage(error)),
    });
  }

  return (
    <PageTransition>
      <h1 className="text-[26px] font-bold tracking-[-0.025em] text-ink">Welcome back</h1>
      <p className="mt-1.5 text-[15px] text-muted">Log in to continue.</p>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Field label="Email" error={form.formState.errors.email?.message}>
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              type="email"
              autoComplete="email"
              aria-describedby={describedBy}
              invalid={!!form.formState.errors.email}
              {...form.register('email')}
            />
          )}
        </Field>

        <Field label="Password" error={form.formState.errors.password?.message}>
          {({ inputId, describedBy }) => (
            <PasswordInput
              id={inputId}
              autoComplete="current-password"
              aria-describedby={describedBy}
              invalid={!!form.formState.errors.password}
              {...form.register('password')}
            />
          )}
        </Field>

        <CheckboxLine
          label={
            <>
              Enable biometric unlock <DemoTag label="NICE-TO-HAVE" />
            </>
          }
          {...form.register('biometric')}
        />

        <Button type="submit" size="lg" className="mt-7" loading={login.isPending}>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        New to Vetiva?{' '}
        <Link
          to="/auth/register"
          className="font-semibold text-olive-deep underline-offset-2 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </PageTransition>
  );
}
