import { useEffect, useRef } from 'react'
import type { Transfer } from '@/api/types'
import { Check } from 'lucide-react'
import { formatMoney } from '@/lib/format'

interface SuccessPanelProps {
  transfer: Transfer
  onDone: () => void
}

export function SuccessPanel({ transfer, onDone }: SuccessPanelProps) {
  const doneRef = useRef<HTMLButtonElement>(null)
  const { recipient } = transfer

  useEffect(() => {
    doneRef.current?.focus()
  }, [])

  return (
    <div className="success-panel">
      <div className="dialog-body success-body">
        <span className="success-icon" aria-hidden="true">
          <Check size={32} aria-hidden="true" />
        </span>
        <h3 className="success-title">Transfer sent</h3>
        <p className="success-amount amount">{formatMoney(transfer.amount)}</p>
        <p className="success-recipient">
          to {recipient.name} · {recipient.bank} · {recipient.accountNumberMasked}
        </p>
        <dl className="success-reference">
          <dt>Reference</dt>
          <dd className="amount">{transfer.reference}</dd>
        </dl>
        <p className="muted-text">The money should arrive within minutes.</p>
      </div>
      <div className="dialog-footer">
        <button
          ref={doneRef}
          type="button"
          className="button button-primary button-block"
          onClick={onDone}
        >
          Back to dashboard
        </button>
      </div>
    </div>
  )
}
