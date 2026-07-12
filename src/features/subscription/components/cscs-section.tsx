import { useEffect, useRef, useState } from 'react';
import { Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioCard } from '@/components/common/radio-card';
import { OkBand } from '@/components/common/status-band';
import { MiniSpinner } from '@/components/common/spinner';
import { DemoTag } from '@/components/common/demo-tag';
import { useCreateCscs, useVerifyCscs } from '@/features/subscription/api';
import type { HolderType } from '@/types/domain';
import { firstName } from '@/lib/utils';
import { Section } from './section';

const DEMO_CSCS = '56854667865';

interface CscsSectionProps {
  mode: HolderType;
  childName: string | null;
  childNin: string;
  userName: string;
  /** Reports the resolved CSCS number (verified or newly created), or null. */
  onResolved: (cscs: string | null) => void;
}

type Choice = 'have' | 'none' | null;

export function CscsSection({ mode, childName, childNin, userName, onResolved }: CscsSectionProps) {
  const [choice, setChoice] = useState<Choice>(null);
  const [number, setNumber] = useState('');
  const [verifiedName, setVerifiedName] = useState<string | null>(null);
  const [showNotFound, setShowNotFound] = useState(false);
  const [created, setCreated] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const verify = useVerifyCscs();
  const createCscs = useCreateCscs();

  // Mode switches reset the whole section (mirrors the prototype's subMode)
  useEffect(() => {
    setChoice(null);
    setNumber('');
    setVerifiedName(null);
    setShowNotFound(false);
    setCreated(false);
    onResolved(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  function handleNumberChange(raw: string) {
    if (choice === 'none') return;
    const value = raw.replace(/\D/g, '').slice(0, 11);
    setNumber(value);
    setVerifiedName(null);
    setCreated(false);
    onResolved(null);

    if (value.length === 11) {
      setChoice('have');
      setShowNotFound(false);
      verify.mutate(
        { number: value, holder: mode, nin: mode === 'minor' ? childNin : undefined },
        {
          onSuccess: (result) => {
            setVerifiedName(result.holderName);
            onResolved(value);
          },
          onError: () => setShowNotFound(true),
        },
      );
    } else {
      setShowNotFound(value.length > 0);
      setChoice(value.length > 0 ? 'have' : null);
    }
  }

  function chooseNone() {
    if (choice === 'none' || createCscs.isPending) return;
    setChoice('none');
    setNumber('');
    setVerifiedName(null);
    setShowNotFound(false);
    onResolved(null);
    createCscs.mutate(
      { holder: mode, nin: mode === 'minor' ? childNin : undefined },
      {
        onSuccess: (result) => {
          setCreated(true);
          onResolved(result.number);
        },
        onError: () => setChoice(null),
      },
    );
  }

  function undoNone() {
    setChoice(null);
    setCreated(false);
    onResolved(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  const isMinor = mode === 'minor';
  const displayName = isMinor ? (childName ?? 'the child') : userName;

  return (
    <Section
      icon={<Landmark className="size-[18px]" aria-hidden />}
      title={
        isMinor
          ? 'Does your child have CSCS with Vetiva?'
          : 'Do you have a CSCS account with Vetiva?'
      }
      description={
        isMinor
          ? 'If yes, enter the child’s Vetiva CSCS account number. If not, select "I don’t know / I don’t have one" — we’ll create one in the child’s name, with you as guardian.'
          : 'If your CSCS account is with another stockbroker, select "I don’t know / I don’t have one" — we’ll create a Vetiva account for you at no cost.'
      }
    >
      <Input
        ref={inputRef}
        className="mt-3"
        inputMode="numeric"
        maxLength={11}
        placeholder={
          isMinor
            ? "Enter the child's 11-digit CSCS number"
            : 'Enter your 11-digit Vetiva CSCS number'
        }
        aria-label="CSCS account number"
        value={number}
        disabled={choice === 'none'}
        invalid={showNotFound}
        onChange={(e) => handleNumberChange(e.target.value)}
      />

      {verify.isPending && (
        <p className="mt-2 text-xs text-muted" aria-live="polite">
          <MiniSpinner className="mr-1.5 size-3.5 border-2" /> Checking account…
        </p>
      )}
      {verifiedName && (
        <OkBand>
          {verifiedName.toUpperCase()} — account verified{' '}
          <DemoTag label="OPEN ITEM: real-time check" className="ml-1.5" />
        </OkBand>
      )}
      {showNotFound && (
        <p className="mt-2 text-xs text-bad" role="alert">
          We couldn't find this account — check the number, or choose "I don't have one" below.
        </p>
      )}

      <Button
        type="button"
        variant="link"
        size="bare"
        className="mt-2"
        disabled={choice === 'none'}
        onClick={() => handleNumberChange(DEMO_CSCS)}
      >
        Use demo number <DemoTag />
      </Button>

      <RadioCard name="cscs-choice" checked={choice === 'none'} onSelect={chooseNone}>
        <span className="text-sm font-semibold text-ink">I don't know / I don't have one</span>
      </RadioCard>

      {createCscs.isPending && (
        <p className="mt-2.5 text-xs text-muted" aria-live="polite">
          <MiniSpinner className="mr-1.5 size-3.5 border-2" /> Requesting{' '}
          {isMinor ? `${firstName(displayName)}'s` : 'your'} CSCS account with Vetiva…
        </p>
      )}
      {created && (
        <>
          <OkBand>
            CSCS creation request received and is processing. This will be provided in your profile
            once available.
          </OkBand>
          <Button type="button" variant="link" size="bare" className="mt-1.5" onClick={undoNone}>
            I actually have one — enter it instead
          </Button>
        </>
      )}
    </Section>
  );
}
