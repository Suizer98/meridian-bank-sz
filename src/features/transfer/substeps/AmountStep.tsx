import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useAccounts, useCustomer } from '@/api/queries'
import { describedBy, FieldError } from '@/components/FieldError'
import { ChevronLeft } from 'lucide-react'
import { getDepositAccounts, getRemainingDailyLimit } from '@/lib/accounts'
import { formatMoney } from '@/lib/format'
import { StepLayout } from './StepLayout'
import { createAmountSchema, NOTE_MAX_LENGTH, type AmountValues } from '@/features/transfer/schema'

const QUICK_AMOUNTS = [50, 100, 250, 500]

interface AmountStepProps {
  defaultValues: AmountValues
  onBack: (values: AmountValues) => void
  onContinue: (values: AmountValues) => void
}

export function AmountStep({ defaultValues, onBack, onContinue }: AmountStepProps) {
  const accounts = useAccounts()
  const customer = useCustomer()

  const depositAccounts = useMemo(() => getDepositAccounts(accounts.data ?? []), [accounts.data])
  const remainingLimit = customer.data ? getRemainingDailyLimit(customer.data) : 0
  const schema = useMemo(
    () => createAmountSchema({ accounts: depositAccounts, remainingLimit }),
    [depositAccounts, remainingLimit],
  )

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    getFieldState,
    trigger,
    control,
    formState: { errors },
  } = useForm<AmountValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onTouched',
  })
  const fromAccountId = useWatch({ control, name: 'fromAccountId' })
  const note = useWatch({ control, name: 'note' })
  const selectedAccount = depositAccounts.find((account) => account.id === fromAccountId)

  return (
    <StepLayout
      title="How much?"
      onSubmit={handleSubmit(onContinue)}
      footer={
        <>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => onBack(getValues())}
          >
            <ChevronLeft size={18} aria-hidden="true" />
            Back
          </button>
          <button type="submit" className="button button-primary">
            Continue
          </button>
        </>
      }
    >
      <div className="field">
        <label htmlFor="from-account">From account</label>
        <select
          id="from-account"
          className="input"
          aria-invalid={Boolean(errors.fromAccountId)}
          aria-describedby={describedBy(
            'from-account-hint',
            errors.fromAccountId && 'from-account-error',
          )}
          {...register('fromAccountId', {
            // The balance rule depends on the account, so re-check an amount already entered.
            onChange: () => {
              if (getFieldState('amount').isTouched) void trigger('amount')
            },
          })}
        >
          {depositAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name} · {account.maskedNumber}
            </option>
          ))}
        </select>
        <p id="from-account-hint" className="field-hint">
          Deposit accounts only
        </p>
        <FieldError id="from-account-error" message={errors.fromAccountId?.message} />
      </div>

      <div className="field">
        <label htmlFor="amount">Amount</label>
        <div className="amount-input">
          <span className="amount-input-prefix" aria-hidden="true">
            SGD
          </span>
          <input
            id="amount"
            className="input"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={describedBy(errors.amount && 'amount-error', 'amount-limits')}
            {...register('amount')}
          />
        </div>
        <FieldError id="amount-error" message={errors.amount?.message} />
        <div className="quick-amounts" role="group" aria-label="Quick amounts">
          {QUICK_AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              className="quick-amount"
              aria-label={`SGD ${value}`}
              onClick={() =>
                setValue('amount', String(value), {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            >
              {value}
            </button>
          ))}
        </div>
        <dl id="amount-limits" className="amount-limits">
          <div>
            <dt>Available</dt>
            <dd className="amount">
              {selectedAccount ? formatMoney(selectedAccount.balance) : '—'}
            </dd>
          </div>
          <div>
            <dt>Remaining daily limit</dt>
            <dd className="amount">{formatMoney(remainingLimit)}</dd>
          </div>
        </dl>
      </div>

      <div className="field">
        <div className="field-label-row">
          <label htmlFor="note">Note (optional)</label>
          <span
            id="note-counter"
            className={note.length > NOTE_MAX_LENGTH ? 'field-counter is-over' : 'field-counter'}
          >
            {note.length}/{NOTE_MAX_LENGTH}
          </span>
        </div>
        <input
          id="note"
          className="input"
          autoComplete="off"
          aria-invalid={Boolean(errors.note)}
          aria-describedby={describedBy('note-counter', errors.note && 'note-error')}
          {...register('note')}
        />
        <FieldError id="note-error" message={errors.note?.message} />
      </div>
    </StepLayout>
  )
}
