import { useState } from 'react'
import { useAccounts, useCustomer, useRecentTransactions } from '../../api/queries'
import { getDepositAccounts, getTotalAvailable } from '../../lib/accounts'
import { SegmentSwitch } from '../preferences/SegmentSwitch'
import { TransferDialog } from '../transfer/TransferDialog'
import { AccountList } from './AccountList'
import { BalanceHero } from './BalanceHero'
import { DailyLimitCard } from './DailyLimitCard'
import { DashboardError } from './DashboardError'
import { DashboardSkeleton } from './DashboardSkeleton'
import { TransactionList } from './TransactionList'
import './dashboard.css'

export function Dashboard() {
  // Call all the queries
  const customer = useCustomer()
  const accounts = useAccounts()
  const transactions = useRecentTransactions()

  // Control transfer dialog open off state
  const [isTransferOpen, setTransferOpen] = useState(false)

  const queries = [customer, accounts, transactions]

  if (customer.data && accounts.data && transactions.data) {
    return (
      <>
        <div className="dashboard">
          <div className="dashboard-main">
            <div className="greeting">
              <h1>Good evening, {customer.data.firstName}</h1>
              <SegmentSwitch className="segment-switch-inline" />
            </div>
            <BalanceHero
              total={getTotalAvailable(accounts.data)}
              depositAccountCount={getDepositAccounts(accounts.data).length}
              onNewTransfer={() => setTransferOpen(true)}
            />
            <AccountList accounts={accounts.data} />
            <TransactionList transactions={transactions.data} />
          </div>
          <aside className="dashboard-rail">
            <DailyLimitCard customer={customer.data} />
          </aside>
        </div>
        {isTransferOpen && <TransferDialog onClose={() => setTransferOpen(false)} />}
      </>
    )
  }

  const failed = queries.filter((query) => query.isError)
  const isRetrying = queries.some((query) => query.isFetching)

  // As long as we are not retrying, show the error
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
