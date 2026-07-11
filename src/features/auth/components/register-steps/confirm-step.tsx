import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Card, SummaryRow } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { useSendOtp } from '@/features/auth/api';
import { useRegisterStore } from '@/features/auth/register-store';
import { confirmIdentitySchema, type ConfirmIdentityValues } from '@/features/auth/schemas';
import { apiErrorMessage } from '@/lib/axios';

export function ConfirmStep({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const identity = useRegisterStore((s) => s.identity);
  const email = useRegisterStore((s) => s.email);
  const setEmail = useRegisterStore((s) => s.setEmail);
  const sendOtp = useSendOtp();

  const form = useForm<ConfirmIdentityValues>({
    resolver: zodResolver(confirmIdentitySchema),
    defaultValues: { email },
  });

  if (!identity) return null;

  function onSubmit({ email: value }: ConfirmIdentityValues) {
    setEmail(value);
    sendOtp.mutate(
      { channel: 'email', destination: value },
      {
        onSuccess: onDone,
        onError: (error) => toast.error(apiErrorMessage(error)),
      },
    );
  }

  return (
    <div>
      <h1 className="text-[26px] font-bold tracking-[-0.025em] text-ink">Is this you?</h1>
      <p className="mt-1.5 text-[15px] text-muted">We pulled these details from your BVN.</p>

      <Avatar name={identity.name} className="mt-5 size-16 text-lg" />

      <Card className="mt-3 p-4">
        <SummaryRow label="Full name" value={identity.name} />
        <SummaryRow label="Date of birth" value={identity.dob} />
        <SummaryRow label="Phone number" value={identity.phone} />
      </Card>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        Pulled from your BVN — can't be edited here. You can update and verify your phone number
        later from your profile.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Field
          label="Email address"
          error={form.formState.errors.email?.message}
          hint="Also from BVN, but editable — this creates your account, so update it if needed."
        >
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

        <Button type="button" variant="link" size="bare" className="mt-3" onClick={onBack}>
          Not you? Re-enter BVN
        </Button>

        <Button type="submit" size="lg" className="mt-7" loading={sendOtp.isPending}>
          Send verification code
        </Button>
      </form>
    </div>
  );
}
