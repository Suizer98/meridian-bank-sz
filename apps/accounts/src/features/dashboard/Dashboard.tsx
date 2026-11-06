import type { ReactNode } from 'react'
import { useAccounts, useCustomer, useRecentTransactions } from '@shared/api/queries'
import { getDepositAccounts, getTotalAvailable } from '@shared/lib/accounts'
import { AccountList } from './AccountList'
import { BalanceHero } from './BalanceHero'
import { DailyLimitCard } from './DailyLimitCard'
import { DashboardError } from './DashboardError'
import { DashboardSkeleton } from './DashboardSkeleton'
import { TransactionList } from './TransactionList'
import './dashboard.css'

interface DashboardProps {
  onNewTransfer: () => void
  greetingControls: ReactNode
}

export function Dashboard({ onNewTransfer, greetingControls }: DashboardProps) {
  const customer = useCustomer()
  const accounts = useAccounts()
  const transactions = useRecentTransactions()

  const queries = [customer, accounts, transactions]

  if (customer.data && accounts.data && transactions.data) {
    return (
      <div className="dashboard">
        <div className="dashboard-main">
          <div className="greeting">
            <h1>Good evening, {customer.data.firstName}</h1>
            {greetingControls}
          </div>
          <BalanceHero
            total={getTotalAvailable(accounts.data)}
            depositAccountCount={getDepositAccounts(accounts.data).length}
            onNewTransfer={onNewTransfer}
          />
          <AccountList accounts={accounts.data} />
          <TransactionList transactions={transactions.data} />
        </div>
        <aside className="dashboard-rail">
          <DailyLimitCard customer={customer.data} />
        </aside>
      </div>
    )
  }

  const failed = queries.filter((query) => query.isError)
  const isRetrying = queries.some((query) => query.isFetching)

  if (failed.length > 0 && !isRetrying) {
    return (
      <DashboardError
        onRetry={() => {
          for (const query of failed) void query.refetch()
        }}
      />
    )
  }

  return <DashboardSkeleton />
}
