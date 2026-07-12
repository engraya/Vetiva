import { useEffect, useState } from 'react';
import { Landmark, PiggyBank } from 'lucide-react';
import { Field, Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { OkBand } from '@/components/common/status-band';
import { MiniSpinner } from '@/components/common/spinner';
import { DemoTag } from '@/components/common/demo-tag';
import { useBanks, useResolveBank } from '@/features/subscription/api';
import type { DividendAccount } from '@/types/api';
import type { HolderType, User } from '@/types/domain';
import { Section } from './section';

interface DividendSectionProps {
  mode: HolderType;
  user: User;
  /** Reports a resolved dividend account, 'guardian' for minors, or null. */
  onResolved: (account: DividendAccount | 'guardian' | null) => void;
}

export function DividendSection({ mode, user, onResolved }: DividendSectionProps) {
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState<string | null>(null);
  const { data: banks } = useBanks();
  const resolve = useResolveBank();

  const isMinor = mode === 'minor';

  // Guardian account is automatic for minors; reset entry state on switch
  useEffect(() => {
    setBankCode('');
    setAccountNumber('');
    setAccountName(null);
    onResolved(isMinor ? 'guardian' : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMinor]);

  function handleAccountChange(raw: string) {
    const value = raw.replace(/\D/g, '').slice(0, 10);
    setAccountNumber(value);
    setAccountName(null);
    onResolved(null);
    if (value.length === 10 && bankCode) {
      resolve.mutate(
        { bankCode, accountNumber: value },
        {
          onSuccess: ({ accountName: resolved }) => {
            setAccountName(resolved);
            const bank = banks?.find((b) => b.code === bankCode);
            onResolved({
              bankCode,
              bankName: bank?.name ?? '',
              accountNumber: value,
              accountName: resolved,
            });
          },
        },
      );
    }
  }

  return (
    <Section
      icon={<PiggyBank className="size-[18px]" aria-hidden />}
      title="Bank account"
      description={
        isMinor
          ? 'Dividends are paid to your account as guardian.'
          : 'Where should we pay your dividends when they are declared?'
      }
    >
      {isMinor ? (
        <div className="mt-3 flex items-center gap-3 rounded-card border border-line bg-card p-4">
          <Landmark className="size-5 shrink-0 text-olive-deep" aria-hidden />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-ink">{user.bankName}</div>
            <div className="tabular mt-0.5 text-xs text-muted">
              {user.name.toUpperCase()} · {user.bankAccount}
            </div>
          </div>
          <Badge variant="guardian">Guardian</Badge>
        </div>
      ) : (
        <>
          <Field label="Bank">
            {({ inputId }) => (
              <Select
                id={inputId}
                value={bankCode}
                onChange={(e) => {
                  setBankCode(e.target.value);
                  setAccountNumber('');
                  setAccountName(null);
                  onResolved(null);
                }}
              >
                <option value="">Select bank</option>
                {banks?.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          {bankCode && (
            <Field label="Account number">
              {({ inputId, describedBy }) => (
                <Input
                  id={inputId}
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit account number"
                  autoComplete="off"
                  value={accountNumber}
                  aria-describedby={describedBy}
                  onChange={(e) => handleAccountChange(e.target.value)}
                />
              )}
            </Field>
          )}

          {resolve.isPending && (
            <p className="mt-2 text-xs text-muted" aria-live="polite">
              <MiniSpinner className="mr-1.5 size-3.5 border-2" /> Resolving account…
            </p>
          )}
          {accountName && (
            <OkBand>
              {accountName} <DemoTag className="ml-1.5" />
            </OkBand>
          )}
        </>
      )}
    </Section>
  );
}
