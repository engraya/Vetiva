import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { StepIndicator } from '@/components/common/step-indicator';
import { PageTransition } from '@/components/common/page-transition';
import { useRegisterStore } from '@/features/auth/register-store';
import { BvnStep } from './register-steps/bvn-step';
import { ConfirmStep } from './register-steps/confirm-step';
import { VerifyStep } from './register-steps/verify-step';

const STEPS = ['Identity', 'Confirm', 'Secure'] as const;
type StepKey = 'bvn' | 'confirm' | 'verify';

const STEP_INDEX: Record<StepKey, number> = { bvn: 0, confirm: 1, verify: 2 };

export function RegisterPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const identity = useRegisterStore((s) => s.identity);

  const requested = (params.get('step') ?? 'bvn') as StepKey;
  // Steps can't be jumped ahead of the data collected so far
  const step: StepKey = requested !== 'bvn' && !identity ? 'bvn' : requested;

  useEffect(() => {
    if (step !== requested) {
      setParams({ step }, { replace: true });
    }
  }, [step, requested, setParams]);

  function goTo(next: StepKey) {
    setParams({ step: next });
  }

  return (
    <PageTransition>
      <StepIndicator steps={STEPS} current={STEP_INDEX[step]} className="mb-8" />
      {step === 'bvn' && <BvnStep onDone={() => goTo('confirm')} />}
      {step === 'confirm' && (
        <ConfirmStep onBack={() => goTo('bvn')} onDone={() => goTo('verify')} />
      )}
      {step === 'verify' && <VerifyStep onDone={() => navigate('/dashboard', { replace: true })} />}
    </PageTransition>
  );
}
