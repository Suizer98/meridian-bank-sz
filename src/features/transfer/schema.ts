import { z } from 'zod'
import type { Account } from '../../api/types'
import { formatMoney } from '../../lib/format'

export const NOTE_MAX_LENGTH = 50

export const recipientSchema = z
  .object({
    mode: z.enum(['saved', 'new']),
    payeeId: z.string(),
    name: z.string(),
    accountNumber: z.string(),
    bank: z.string(),
  })
  .superRefine((value, ctx) => {
    const fail = (path: 'payeeId' | 'name' | 'accountNumber' | 'bank', message: string) =>
      ctx.addIssue({ code: 'custom', path: [path], message })

    if (value.mode === 'saved') {
      if (!value.payeeId) fail('payeeId', 'Choose who you’re sending to.')
      return
    }

    const name = value.name.trim()
    if (name.length < 2 || name.length > 50) {
      fail('name', 'Enter a name between 2 and 50 characters.')
    }
    if (!/^\d{8}$/.test(value.accountNumber.trim())) {
      fail('accountNumber', 'Enter a valid 8-digit account number.')
    }
    if (!value.bank) {
      fail('bank', 'Choose a bank.')
    }
  })

export type RecipientValues = z.infer<typeof recipientSchema>

interface AmountRules {
  accounts: Account[]
  remainingLimit: number
}

// Balance and daily limit come from the API, so the schema is built per dialog.
export function createAmountSchema({ accounts, remainingLimit }: AmountRules) {
  return z
    .object({
      fromAccountId: z.string().min(1, 'Choose an account to send from.'),
      amount: z
        .string()
        .trim()
        .min(1, 'Enter an amount.')
        .regex(/^\d+(\.\d+)?$/, 'Enter a number, like 120.50.')
        .regex(/^\d+(\.\d{1,2})?$/, 'Use at most 2 decimal places.')
        .refine((value) => Number(value) >= 1, 'Enter at least SGD 1.00.'),
      note: z
        .string()
        .max(NOTE_MAX_LENGTH, `Keep the note to ${NOTE_MAX_LENGTH} characters or fewer.`),
    })
    .superRefine((value, ctx) => {
      const amount = Number(value.amount)
      if (!Number.isFinite(amount)) return

      const account = accounts.find((item) => item.id === value.fromAccountId)
      if (account && amount > account.balance) {
        ctx.addIssue({
          code: 'custom',
          path: ['amount'],
          message: `Amount can't be more than your available balance (${formatMoney(account.balance)}).`,
        })
        return
      }

      if (amount > remainingLimit) {
        ctx.addIssue({
          code: 'custom',
          path: ['amount'],
          message: `This transfer exceeds your remaining daily limit (${formatMoney(remainingLimit)}).`,
        })
      }
    })
}

export type AmountValues = z.infer<ReturnType<typeof createAmountSchema>>
