import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { DemoTag } from '@/components/common/demo-tag';
import { useBvnLookup } from '@/features/auth/api';
import { useRegisterStore } from '@/features/auth/register-store';
import { bvnSchema, type BvnFormValues } from '@/features/auth/schemas';
import { apiErrorMessage } from '@/lib/axios';

const DEMO_BVN = '22212345678';

export function BvnStep({ onDone }: { onDone: () => void }) {
  const setBvnResult = useRegisterStore((s) => s.setBvnResult);
  const lookup = useBvnLookup();

  const form = useForm<BvnFormValues>({
    resolver: zodResolver(bvnSchema),
    mode: 'onChange',
    defaultValues: { bvn: useRegisterStore.getState().bvn },
  });

  function onSubmit({ bvn }: BvnFormValues) {
    lookup.mutate(
      { bvn },
      {
        onSuccess: (identity) => {
          setBvnResult(bvn, identity);
          onDone();
        },
        onError: (error) => toast.error(apiErrorMessage(error)),
      },
    );
  }

  const bvnValue = form.watch('bvn');

  return (
    <div>
      <h1 className="text-[26px] font-bold tracking-[-0.025em] text-ink">Verify your identity</h1>
      <p className="mt-1.5 text-[15px] text-muted">Enter your BVN to get started.</p>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Field
          label="BVN"
          error={form.formState.errors.bvn?.message}
          hint="Used only to verify your identity — never shared."
        >
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              inputMode="numeric"
              maxLength={11}
              placeholder="11-digit BVN"
              autoComplete="off"
              aria-describedby={describedBy}
              invalid={!!form.formState.errors.bvn}
              {...form.register('bvn', {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11);
                },
              })}
            />
          )}
        </Field>

        <Button
          type="button"
          variant="link"
          size="bare"
          className="mt-2"
          onClick={() =>
            form.setValue('bvn', DEMO_BVN, { shouldValidate: true, shouldDirty: true })
          }
        >
          Use demo BVN <DemoTag />
        </Button>

        <Button
          type="submit"
          size="lg"
          className="mt-8"
          disabled={bvnValue.length !== 11}
          loading={lookup.isPending}
        >
          Continue
        </Button>
      </form>
    </div>
  );
}
