import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { OtpInput } from '@/components/common/otp-input';
import { DemoTag } from '@/components/common/demo-tag';
import { useUpdatePhone, useVerifyPhone } from '@/features/profile/api';
import { apiErrorMessage } from '@/lib/axios';
import type { User } from '@/types/domain';

export function PhoneVerification({ user }: { user: User }) {
  const [phone, setPhone] = useState(user.phone);
  const [otpStage, setOtpStage] = useState(false);
  const [otp, setOtp] = useState('');
  const updatePhone = useUpdatePhone();
  const verifyPhone = useVerifyPhone();

  function sendCode() {
    if (phone.length !== 11) {
      toast.error('Phone number must be 11 digits');
      return;
    }
    updatePhone.mutate(
      { phone },
      {
        onSuccess: () => {
          setOtpStage(true);
          setOtp('');
        },
        onError: (error) => toast.error(apiErrorMessage(error)),
      },
    );
  }

  function verify() {
    verifyPhone.mutate(
      { code: otp },
      {
        onSuccess: () => {
          toast.success('Phone number verified ✓');
          setOtpStage(false);
          setOtp('');
        },
        onError: (error) => toast.error(apiErrorMessage(error)),
      },
    );
  }

  return (
    <div>
      <Field label="Phone number">
        {({ inputId }) => (
          <Input
            id={inputId}
            inputMode="numeric"
            maxLength={11}
            autoComplete="tel-national"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
          />
        )}
      </Field>

      {!otpStage ? (
        <Button
          size="lg"
          className="mt-4"
          onClick={sendCode}
          loading={updatePhone.isPending}
          disabled={phone.length !== 11}
        >
          {user.phoneVerified ? 'Update & re-verify number' : 'Send verification code'}
        </Button>
      ) : (
        <div className="mt-4">
          <p className="text-xs leading-relaxed text-muted">
            Enter the 6-digit code we sent to{' '}
            <span className="font-semibold text-ink">{phone}</span> by SMS. <DemoTag />
          </p>
          <OtpInput
            className="mt-3"
            value={otp}
            onChange={setOtp}
            disabled={verifyPhone.isPending}
            aria-label="SMS verification code"
          />
          <Button
            type="button"
            variant="link"
            size="bare"
            className="mt-2"
            onClick={() => setOtp('123456')}
          >
            Autofill code <DemoTag />
          </Button>
          <Button
            size="lg"
            className="mt-4"
            onClick={verify}
            disabled={otp.length !== 6}
            loading={verifyPhone.isPending}
          >
            Verify phone number
          </Button>
        </div>
      )}
    </div>
  );
}
