import type { Account } from '@/api/types'

export function AccountList({ accounts }: { accounts: Account[] }) {
  return (
    <section className="dashboard-section" aria-labelledby="accounts-title">
      <h2 id="accounts-title" className="section-title">
        Accounts
      </h2>
      {accounts.length === 0 ? (
        <div className="empty-state card">
          <p>No accounts to show.</p>
        </div>
      ) : (
        <ul className="account-list">
          {accounts.map((account) => (
            <li key={account.id}>
              <AccountCard account={account} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function AccountCard({ account }: { account: Account }) {
  return (
    <article className="account-card">
      <h3 className="account-card-name">{account.name}</h3>
      <p className="account-card-number amount">{account.maskedNumber}</p>
      <p className="account-card-balance amount">
        {account.currency} {account.balance}
      </p>
      {account.type === 'credit' && <p className="account-card-due">Amount due</p>}
    </article>
  )
}
