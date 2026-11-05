import { useRef, useState } from 'react'
import type { Transaction } from '@/api/types'
import { Search, X } from 'lucide-react'
import { formatMoney, formatShortDate } from '@/lib/format'

function matchesSearch(transaction: Transaction, term: string): boolean {
  return (
    transaction.description.toLowerCase().includes(term) ||
    transaction.category.toLowerCase().includes(term)
  )
}

function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const term = search.trim().toLowerCase()
  const visible = term
    ? transactions.filter((transaction) => matchesSearch(transaction, term))
    : transactions

  function clearSearch() {
    setSearch('')
    inputRef.current?.focus()
  }

  return (
    <section className="dashboard-section" aria-labelledby="transactions-title">
      <div className="section-header">
        <h2 id="transactions-title" className="section-title">
          Recent transactions
        </h2>
        <div className="search-input">
          <Search size={18} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            className="input"
            aria-label="Search transactions"
            placeholder="Search transactions"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button
              type="button"
              className="search-clear"
              aria-label="Clear search"
              onClick={clearSearch}
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="search-summary" role="status">
          {term
            ? `${visible.length} of ${transactions.length} transactions match “${search.trim()}”`
            : ''}
        </p>

        {transactions.length === 0 ? (
          <div className="empty-state card">
            <p>No transactions yet.</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="empty-state card">
            <p>No transactions match your search.</p>
            <button type="button" className="button button-secondary" onClick={clearSearch}>
              Clear search
            </button>
          </div>
        ) : (
          <ul className="transaction-list">
            {visible.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isIncoming = transaction.direction === 'in'

  return (
    <li className="transaction-row">
      <div className="transaction-main">
        <p className="transaction-description">{transaction.description}</p>
        <p className="transaction-meta">
          {formatCategory(transaction.category)} · {formatShortDate(transaction.date)}
        </p>
      </div>
      <div className="transaction-side">
        <p className={isIncoming ? 'transaction-amount amount is-incoming' : 'transaction-amount amount'}>
          {isIncoming ? `+${formatMoney(transaction.amount)}` : formatMoney(-transaction.amount)}
        </p>
        {transaction.status === 'pending' && <span className="chip">Pending</span>}
      </div>
    </li>
  )
}
