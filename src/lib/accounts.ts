import type { Account, Customer } from '@/api/types'

const roundMoney = (amount: number) => Math.round(amount * 100) / 100

export function isDepositAccount(account: Account): boolean {
  return account.type !== 'credit'
}

export function getDepositAccounts(accounts: Account[]): Account[] {
  return accounts.filter(isDepositAccount)
}

export function getTotalAvailable(accounts: Account[]): number {
  return roundMoney(
    getDepositAccounts(accounts).reduce((sum, account) => sum + account.balance, 0),
  )
}

export function getRemainingDailyLimit(customer: Customer): number {
  return roundMoney(customer.dailyTransferLimit - customer.transferredToday)
}
