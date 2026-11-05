import { Skeleton } from '@/components/Skeleton'
import { RECENT_TRANSACTIONS_LIMIT } from '@/api/queries'

const ACCOUNT_PLACEHOLDERS = 3

export function DashboardSkeleton() {
  return (
    <div className="dashboard" aria-busy="true">
      <p className="sr-only" role="status">
        Loading your dashboard…
      </p>
      <div className="dashboard-main">
        <div className="greeting">
          <Skeleton width={280} height={40} />
        </div>

        <div className="balance-hero balance-hero-skeleton">
          <div className="skeleton-stack">
            <Skeleton width={120} height={14} />
            <Skeleton width={240} height={44} />
            <Skeleton width={180} height={14} />
          </div>
        </div>

        <div className="dashboard-section">
          <Skeleton width={90} height={18} />
          <div className="account-list">
            {[...Array(ACCOUNT_PLACEHOLDERS).keys()].map((index) => (
              <div key={index} className="account-card">
                <Skeleton width="60%" height={18} />
                <Skeleton width="40%" height={14} />
                <div className="account-card-balance">
                  <Skeleton width="55%" height={26} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <Skeleton width={180} height={18} />
          <div className="transaction-list">
            {[...Array(RECENT_TRANSACTIONS_LIMIT).keys()].map((index) => (
              <div key={index} className="transaction-row">
                <div className="skeleton-stack">
                  <Skeleton width={160} height={16} />
                  <Skeleton width={110} height={14} />
                </div>
                <Skeleton width={80} height={16} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="dashboard-rail">
        <div className="card daily-limit">
          <Skeleton width={90} height={18} />
          <Skeleton width={180} height={32} />
          <Skeleton height={8} radius="var(--radius-full)" />
          <Skeleton width="80%" height={14} />
        </div>
      </aside>
    </div>
  )
}
