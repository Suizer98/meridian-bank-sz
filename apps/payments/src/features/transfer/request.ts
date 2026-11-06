import { ApiError } from '@shared/api/client'
import type { CreateTransferRequest, Payee, TransferRecipient } from '@shared/api/types'
import type { AmountValues, RecipientValues } from './schema'

export const TRANSFER_FEE = 0

const RECIPIENT_FIELDS: Record<string, keyof RecipientValues> = {
  payeeId: 'payeeId',
  'recipient.name': 'name',
  'recipient.accountNumber': 'accountNumber',
  'recipient.bank': 'bank',
}

const AMOUNT_FIELDS: Record<string, keyof AmountValues> = {
  fromAccountId: 'fromAccountId',
  amount: 'amount',
  note: 'note',
}

export type FieldMessages<T> = Partial<Record<keyof T, string>>

export type ServerError =
  | { step: 'recipient'; message: string; fields: FieldMessages<RecipientValues> }
  | { step: 'amount'; message: string; fields: FieldMessages<AmountValues> }

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

function pickFields<T>(
  fields: Record<string, string>,
  names: Record<string, keyof T>,
): FieldMessages<T> {
  const picked: FieldMessages<T> = {}
  for (const [apiName, message] of Object.entries(fields)) {
    const name = names[apiName]
    if (name) picked[name] = message
  }
  return picked
}

export function getServerError(error: unknown): ServerError | null {
  if (!(error instanceof ApiError) || !error.fields) return null

  const recipientFields = pickFields(error.fields, RECIPIENT_FIELDS)
  if (Object.keys(recipientFields).length > 0) {
    return { step: 'recipient', message: error.message, fields: recipientFields }
  }

  const amountFields = pickFields(error.fields, AMOUNT_FIELDS)
  if (Object.keys(amountFields).length > 0) {
    return { step: 'amount', message: error.message, fields: amountFields }
  }

  return null
}
