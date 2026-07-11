import { useState } from 'react';
import { Link } from 'react-router';
import { Baby, UserRound, Users } from 'lucide-react';
import { Field, Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/common/segmented-control';
import { OkBand, WarnBand } from '@/components/common/status-band';
import { DemoTag } from '@/components/common/demo-tag';
import { useVerifyNin } from '@/features/subscription/api';
import type { NinVerifyResponse } from '@/types/api';
import type { HolderType, Subscription } from '@/types/domain';
import { firstName, maskTail } from '@/lib/utils';
import { Section } from './section';

const DEMO_NIN = '98765432101';

interface WhoForSectionProps {
  mode: HolderType;
  onModeChange: (mode: HolderType) => void;
  userName: string;
  selfSubscription: Subscription | undefined;
  child: NinVerifyResponse | null;
  onChildChange: (child: NinVerifyResponse | null, nin: string) => void;
}

export function WhoForSection({
  mode,
  onModeChange,
  userName,
  selfSubscription,
  child,
  onChildChange,
}: WhoForSectionProps) {
  const [nin, setNin] = useState('');
  const [ninError, setNinError] = useState<string | null>(null);
  const verifyNin = useVerifyNin();

  function handleNinChange(raw: string) {
    const value = raw.replace(/\D/g, '').slice(0, 11);
    setNin(value);
    onChildChange(null, value);
    if (value.length === 11) {
      setNinError(null);
      verifyNin.mutate(
        { nin: value },
        {
          onSuccess: (result) => onChildChange(result, value),
          onError: () => setNinError('We couldn’t verify this NIN — check the number.'),
        },
      );
    } else {
      setNinError(value.length > 0 ? 'NIN must be 11 digits' : null);
    }
  }

  function switchMode(next: HolderType) {
    setNin('');
    setNinError(null);
    onChildChange(null, '');
    onModeChange(next);
  }

  return (
    <Section
      step={1}
      icon={<Users className="size-[18px]" aria-hidden />}
      title="Who is this subscription for?"
    >
      <SegmentedControl
        aria-label="Subscription holder"
        value={mode}
        onChange={switchMode}
        options={[
          {
            value: 'self',
            label: (
              <>
                <UserRound className="size-4" aria-hidden /> Myself
              </>
            ),
          },
          {
            value: 'minor',
            label: (
              <>
                <Baby className="size-4" aria-hidden /> A minor
              </>
            ),
          },
        ]}
      />

      {mode === 'self' &&
        (selfSubscription ? (
          <WarnBand>
            You've already subscribed for yourself ({selfSubscription.shares.toLocaleString()}{' '}
            shares). Use <strong>Top up</strong> to add more, or switch to "A minor".{' '}
            <Link
              to={`/top-up/${selfSubscription.id}`}
              className="font-bold underline underline-offset-2"
            >
              Top up instead →
            </Link>
          </WarnBand>
        ) : (
          <OkBand>{userName}</OkBand>
        ))}

      {mode === 'minor' && (
        <>
          <Field
            label="Child's NIN"
            error={ninError ?? undefined}
            hint={`Used only to verify the child's identity and open their CSCS account. You (${userName}) are recorded as guardian.`}
          >
            {({ inputId, describedBy }) => (
              <Input
                id={inputId}
                inputMode="numeric"
                maxLength={11}
                placeholder="11-digit NIN"
                autoComplete="off"
                value={nin}
                aria-describedby={describedBy}
                invalid={!!ninError}
                onChange={(e) => handleNinChange(e.target.value)}
              />
            )}
          </Field>
          {verifyNin.isPending && (
            <p className="mt-2 text-xs text-muted" aria-live="polite">
              Verifying NIN…
            </p>
          )}
          {child && (
            <>
              <OkBand>
                {child.name} verified · NIN {maskTail(nin)} <DemoTag className="ml-1.5" />
              </OkBand>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                When {firstName(child.name)} turns 18, the account converts to their sole control.
              </p>
            </>
          )}
          <Button
            type="button"
            variant="link"
            size="bare"
            className="mt-2"
            onClick={() => handleNinChange(DEMO_NIN)}
          >
            Use demo NIN <DemoTag />
          </Button>
        </>
      )}
    </Section>
  );
}
