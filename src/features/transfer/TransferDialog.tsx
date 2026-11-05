import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAccounts, useCreateTransfer } from '@/api/queries'
import { getDepositAccounts } from '@/lib/accounts'
import { formatMoney } from '@/lib/format'
import { buildTransferRequest } from './request'
import { AmountStep } from './substeps/AmountStep'
import { RecipientStep } from './substeps/RecipientStep'
import { ReviewStep } from './substeps/ReviewStep'
import type { AmountValues, RecipientValues } from './schema'
import { Stepper, type TransferStep } from './Stepper'
import { SuccessPanel } from './SuccessPanel'
import './transfer.css'

const EMPTY_RECIPIENT: RecipientValues = {
  mode: 'saved',
  payeeId: '',
  name: '',
  accountNumber: '',
  bank: '',
}

export function TransferDialog({ onClose }: { onClose: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null)

  // Refetch accounts and create transfer, instead of passing the data in props
  const accounts = useAccounts()
  const transfer = useCreateTransfer()

  // Local state
  const [step, setStep] = useState<TransferStep>('recipient')
  const [recipient, setRecipient] = useState<RecipientValues>(EMPTY_RECIPIENT)
  const [amount, setAmount] = useState<AmountValues>(() => ({
    fromAccountId: getDepositAccounts(accounts.data ?? [])[0]?.id ?? '',
    amount: '',
    note: '',
  }))

  function focusStepHeading() {
    contentRef.current?.querySelector<HTMLElement>('[data-step-heading]')?.focus()
  }

  useEffect(() => {
    if (!transfer.isSuccess) focusStepHeading()
  }, [step, transfer.isSuccess])

  const sent = transfer.data?.transfer

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content
          ref={contentRef}
          className="transfer-dialog"
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            focusStepHeading()
          }}
          // A stray click on the backdrop shouldn't throw away a half-filled transfer.
          onInteractOutside={(event) => event.preventDefault()}
        >
          <div className="dialog-header">
            <Dialog.Title className="dialog-title">New transfer</Dialog.Title>
            <Dialog.Close className="icon-button" aria-label="Close">
              <X size={20} aria-hidden="true" />
            </Dialog.Close>
          </div>

          <p className="sr-only" aria-live="polite">
            {sent ? `Transfer sent. ${formatMoney(sent.amount)} to ${sent.recipient.name}.` : ''}
          </p>

          {sent ? (
            <SuccessPanel transfer={sent} onDone={onClose} />
          ) : (
            <>
              <Stepper current={step} />

              {step === 'recipient' && (
                <RecipientStep
                  defaultValues={recipient}
                  onCancel={onClose}
                  onContinue={(values) => {
                    setRecipient(values)
                    setStep('amount')
                  }}
                />
              )}

              {step === 'amount' && (
                <AmountStep
                  defaultValues={amount}
                  onBack={(values) => {
                    setAmount(values)
                    setStep('recipient')
                  }}
                  onContinue={(values) => {
                    setAmount(values)
                    setStep('review')
                  }}
                />
              )}

              {step === 'review' && (
                <ReviewStep
                  recipient={recipient}
                  amount={amount}
                  isSending={transfer.isPending}
                  error={transfer.error}
                  onBack={() => {
                    transfer.reset()
                    setStep('amount')
                  }}
                  onConfirm={() => transfer.mutate(buildTransferRequest(recipient, amount))}
                />
              )}
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
