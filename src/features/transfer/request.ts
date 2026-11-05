import type { CreateTransferRequest, Payee, TransferRecipient } from '@/api/types'
import type { AmountValues, RecipientValues } from './schema'

export const TRANSFER_FEE = 0

export function buildTransferRequest(
  recipient: RecipientValues,
  amount: AmountValues,
): CreateTransferRequest {
  const note = amount.note.trim()
  const base = {
    fromAccountId: amount.fromAccountId,
    amount: Number(amount.amount),
    ...(note ? { note } : {}),
  }

  if (recipient.mode === 'saved') {
    return { ...base, payeeId: recipient.payeeId }
  }

  return {
    ...base,
    recipient: {
      name: recipient.name.trim(),
      accountNumber: recipient.accountNumber.trim(),
      bank: recipient.bank,
    },
  }
}

export function describeRecipient(
  recipient: RecipientValues,
  payees: Payee[],
): TransferRecipient | null {
  if (recipient.mode === 'saved') {
    const payee = payees.find((item) => item.id === recipient.payeeId)
    if (!payee) return null
    return { name: payee.name, bank: payee.bank, accountNumberMasked: payee.accountNumberMasked }
  }

  return {
    name: recipient.name.trim(),
    bank: recipient.bank,
    accountNumberMasked: `•••• ${recipient.accountNumber.trim().slice(-4)}`,
  }
}
