import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { TopNav } from '@/components/common/top-nav';
import { PageTransition } from '@/components/common/page-transition';
import { useRegisterStore } from '@/features/auth/register-store';
import { BvnStep } from './register-steps/bvn-step';
import { ConfirmStep } from './register-steps/confirm-step';
import { VerifyStep } from './register-steps/verify-step';

type StepKey = 'bvn' | 'confirm' | 'verify';

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

  function backFrom(current: StepKey) {
    if (current === 'bvn') navigate('/');
    else if (current === 'confirm') goTo('bvn');
    else goTo('confirm');
  }

  return (
    <PageTransition>
      <TopNav title="Create account" onBack={() => backFrom(step)} className="mb-2" />
      {step === 'bvn' && <BvnStep onDone={() => goTo('confirm')} />}
      {step === 'confirm' && (
        <ConfirmStep onBack={() => goTo('bvn')} onDone={() => goTo('verify')} />
      )}
      {step === 'verify' && (
        // Approved flow: registration lands on the Offers page
        <VerifyStep onDone={() => navigate('/offers', { replace: true })} />
      )}
    </PageTransition>
  );
}
