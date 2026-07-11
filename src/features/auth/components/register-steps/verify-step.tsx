import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { OtpInput } from '@/components/common/otp-input';
import { DemoTag } from '@/components/common/demo-tag';
import { useRegister, useVerifyOtp } from '@/features/auth/api';
import { useRegisterStore } from '@/features/auth/register-store';
import { verifySchema, type VerifyValues } from '@/features/auth/schemas';
import { apiErrorMessage } from '@/lib/axios';
import { firstName } from '@/lib/utils';
import { DEMO_OTP } from '@/mocks/db';

export function VerifyStep({ onDone }: { onDone: () => void }) {
  const { bvn, email, accountType, identity, reset } = useRegisterStore();
  const verifyOtp = useVerifyOtp();
  const register = useRegister();

  const form = useForm<VerifyValues>({
    resolver: zodResolver(verifySchema),
    mode: 'onChange',
    defaultValues: { otp: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(values: VerifyValues) {
    try {
      await verifyOtp.mutateAsync({ destination: email, code: values.otp });
      await register.mutateAsync({ bvn, email, password: values.password, accountType });
      toast.success(`Account created — welcome, ${firstName(identity?.name ?? '')}!`);
      reset();
      onDone();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  }

  const pending = verifyOtp.isPending || register.isPending;

  return (
    <div>
      <h1 className="text-[26px] font-bold tracking-[-0.025em] text-ink">Verify your email</h1>
      <p className="mt-1.5 text-[15px] text-muted">
        Enter the 6-digit code we sent to <span className="font-semibold text-ink">{email}</span>.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="mt-5">
          <Controller
            control={form.control}
            name="otp"
            render={({ field }) => (
              <OtpInput value={field.value} onChange={field.onChange} disabled={pending} />
            )}
          />
          <Button
            type="button"
            variant="link"
            size="bare"
            className="mt-2"
            onClick={() => form.setValue('otp', DEMO_OTP, { shouldValidate: true })}
          >
            Autofill code <DemoTag />
          </Button>
          <p className="mt-2.5 text-xs leading-relaxed text-muted">
            📱 You'll be able to verify your phone number later from your profile — do it so you
            don't miss communications from us.
          </p>
        </div>

        <Field
          label="Create a password"
          error={form.formState.errors.password?.message}
          hint="Used to log in and approve transactions. At least 8 characters with letters and numbers."
        >
          {({ inputId, describedBy }) => (
            <PasswordInput
              id={inputId}
              placeholder="Alphanumeric password"
              autoComplete="new-password"
              aria-describedby={describedBy}
              invalid={!!form.formState.errors.password}
              {...form.register('password')}
            />
          )}
        </Field>

        <Field label="Re-enter password" error={form.formState.errors.confirmPassword?.message}>
          {({ inputId, describedBy }) => (
            <PasswordInput
              id={inputId}
              placeholder="Repeat the same password"
              autoComplete="new-password"
              aria-describedby={describedBy}
              invalid={!!form.formState.errors.confirmPassword}
              {...form.register('confirmPassword')}
            />
          )}
        </Field>

        <Button
          type="submit"
          size="lg"
          className="mt-8"
          disabled={!form.formState.isValid}
          loading={pending}
        >
          Finish setup
        </Button>
      </form>
    </div>
  );
}
