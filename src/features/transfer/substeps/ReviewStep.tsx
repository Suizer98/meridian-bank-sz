import { useAccounts, usePayees } from '@/api/queries'
import { ApiError } from '@/api/client'
import { ChevronLeft, Info } from 'lucide-react'
import { formatMoney } from '@/lib/format'
import { StepLayout } from './StepLayout'
import { describeRecipient, TRANSFER_FEE } from '@/features/transfer/request'
import type { AmountValues, RecipientValues } from '@/features/transfer/schema'

const SEND_ERROR = "Something went wrong. Your money hasn't left your account. Try again."

interface ReviewStepProps {
  recipient: RecipientValues
  amount: AmountValues
  isSending: boolean
  error: Error | null
  onBack: () => void
  onConfirm: () => void
}

export function ReviewStep({
  recipient,
  amount,
  isSending,
  error,
  onBack,
  onConfirm,
}: ReviewStepProps) {
  const accounts = useAccounts()
  const payees = usePayees()

  const fromAccount = accounts.data?.find((account) => account.id === amount.fromAccountId)
  const to = describeRecipient(recipient, payees.data ?? [])
  const value = Number(amount.amount)
  const note = amount.note.trim()

  return (
    <StepLayout
      title="Check the details"
      onSubmit={(event) => {
        event.preventDefault()
        if (!isSending) onConfirm()
      }}
      footer={
        <>
          <button
            type="button"
            className="button button-secondary"
            onClick={onBack}
            disabled={isSending}
          >
            <ChevronLeft size={18} aria-hidden="true" />
            Back
          </button>
          <button type="submit" className="button button-primary" disabled={isSending}>
            {isSending ? 'Sending…' : 'Confirm transfer'}
          </button>
        </>
      }
    >
      <dl className="review-list">
        <div>
          <dt>From</dt>
          <dd>
            {fromAccount ? `${fromAccount.name} · ${fromAccount.maskedNumber}` : '—'}
          </dd>
        </div>
        <div>
          <dt>To</dt>
          <dd>{to ? `${to.name} · ${to.bank} · ${to.accountNumberMasked}` : '—'}</dd>
        </div>
        <div>
          <dt>Amount</dt>
          <dd className="amount">{formatMoney(value)}</dd>
        </div>
        <div>
          <dt>Fee</dt>
          <dd className="amount">{formatMoney(TRANSFER_FEE)}</dd>
        </div>
        <div>
          <dt>Note</dt>
          <dd>{note || 'None'}</dd>
        </div>
        <div className="review-total">
          <dt>Total</dt>
          <dd className="amount">{formatMoney(value + TRANSFER_FEE)}</dd>
        </div>
      </dl>

      <p className="review-info">
        <Info size={18} aria-hidden="true" />
        Usually arrives in minutes.
      </p>

      {error && <TransferError error={error} />}
    </StepLayout>
  )
}

function TransferError({ error }: { error: Error }) {
  const fieldMessages =
    error instanceof ApiError && error.fields ? Object.values(error.fields) : []

  if (fieldMessages.length === 0) {
    return (
      <div className="alert" role="alert">
        <p>{SEND_ERROR}</p>
      </div>
    )
  }

  return (
    <div className="alert" role="alert">
      <p>{error.message}</p>
      <ul>
        {fieldMessages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  )
}
