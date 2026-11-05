import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { usePayees } from '../../api/queries'
import { describedBy, FieldError } from '../../components/FieldError'
import { Search, UserPlus } from 'lucide-react'
import { Skeleton } from '../../components/Skeleton'
import { StepLayout } from './StepLayout'
import { recipientSchema, type RecipientValues } from './schema'

const BANKS = ['DBS', 'POSB', 'OCBC', 'UOB', 'Standard Chartered', 'HSBC', 'Maybank', 'Citibank']

interface RecipientStepProps {
  defaultValues: RecipientValues
  onCancel: () => void
  onContinue: (values: RecipientValues) => void
}

export function RecipientStep({ defaultValues, onCancel, onContinue }: RecipientStepProps) {
  const payees = usePayees()
  const [search, setSearch] = useState('')
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<RecipientValues>({
    resolver: zodResolver(recipientSchema),
    defaultValues,
    mode: 'onTouched',
  })
  const mode = useWatch({ control, name: 'mode' })

  const term = search.trim().toLowerCase()
  const visiblePayees = (payees.data ?? []).filter(
    (payee) =>
      payee.name.toLowerCase().includes(term) || payee.bank.toLowerCase().includes(term),
  )

  function toggleNewRecipient() {
    if (mode === 'new') {
      setValue('mode', 'saved')
      return
    }
    setValue('mode', 'new')
    setValue('payeeId', '')
  }

  return (
    <StepLayout
      title="Who are you sending to?"
      onSubmit={handleSubmit(onContinue)}
      footer={
        <>
          <button type="button" className="button button-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="button button-primary">
            Continue
          </button>
        </>
      }
    >
      {payees.isPending && (
        <div className="payee-list" aria-busy="true">
          {[...Array(3).keys()].map((index) => (
            <div key={index} className="payee-option">
              <Skeleton width={40} height={40} radius="var(--radius-full)" />
              <div className="payee-text">
                <Skeleton width="50%" height={16} />
                <Skeleton width="35%" height={14} />
              </div>
            </div>
          ))}
        </div>
      )}

      {payees.isError && (
        <div className="alert" role="alert">
          <p>We couldn't load your payees.</p>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => void payees.refetch()}
          >
            Retry
          </button>
        </div>
      )}

      {payees.data && payees.data.length === 0 && (
        <p className="muted-text">You don't have any saved payees yet.</p>
      )}

      {payees.data && payees.data.length > 0 && (
        <>
          <div className="search-input">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              className="input"
              aria-label="Search payees"
              placeholder="Search payees"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.preventDefault()
              }}
            />
          </div>

          <fieldset className="payee-fieldset">
            <legend className="sr-only">Saved payees</legend>
            {visiblePayees.length === 0 ? (
              <p className="muted-text">No payees match your search.</p>
            ) : (
              <ul className="payee-list">
                {visiblePayees.map((payee) => (
                  <li key={payee.id}>
                    <label className="payee-option">
                      <input
                        type="radio"
                        className="visually-hidden-input"
                        value={payee.id}
                        aria-describedby={describedBy(errors.payeeId && 'payee-error')}
                        {...register('payeeId', {
                          onChange: () => setValue('mode', 'saved'),
                        })}
                      />
                      <span className="payee-avatar" aria-hidden="true">
                        {payee.initials}
                      </span>
                      <span className="payee-text">
                        <span className="payee-name">{payee.name}</span>
                        <span className="payee-meta">
                          {payee.bank} · {payee.accountNumberMasked}
                        </span>
                      </span>
                      <span className="payee-radio" aria-hidden="true" />
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </fieldset>
          <FieldError id="payee-error" message={errors.payeeId?.message} />
        </>
      )}

      <button
        type="button"
        className="disclosure"
        aria-expanded={mode === 'new'}
        aria-controls="new-recipient-fields"
        onClick={toggleNewRecipient}
      >
        <UserPlus size={20} aria-hidden="true" />
        Send to someone new
      </button>

      {mode === 'new' && (
        <div id="new-recipient-fields" className="new-recipient">
          <div className="field">
            <label htmlFor="recipient-name">Recipient name</label>
            <input
              id="recipient-name"
              className="input"
              autoComplete="off"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedBy(errors.name && 'recipient-name-error')}
              {...register('name')}
            />
            <FieldError id="recipient-name-error" message={errors.name?.message} />
          </div>

          <div className="field">
            <label htmlFor="recipient-account">Account number</label>
            <input
              id="recipient-account"
              className="input amount"
              inputMode="numeric"
              autoComplete="off"
              aria-invalid={Boolean(errors.accountNumber)}
              aria-describedby={describedBy(
                'recipient-account-hint',
                errors.accountNumber && 'recipient-account-error',
              )}
              {...register('accountNumber')}
            />
            <p id="recipient-account-hint" className="field-hint">
              8 digits
            </p>
            <FieldError id="recipient-account-error" message={errors.accountNumber?.message} />
          </div>

          <div className="field">
            <label htmlFor="recipient-bank">Bank</label>
            <select
              id="recipient-bank"
              className="input"
              aria-invalid={Boolean(errors.bank)}
              aria-describedby={describedBy(errors.bank && 'recipient-bank-error')}
              {...register('bank')}
            >
              <option value="">Choose a bank</option>
              {BANKS.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
            <FieldError id="recipient-bank-error" message={errors.bank?.message} />
          </div>
        </div>
      )}
    </StepLayout>
  )
}
