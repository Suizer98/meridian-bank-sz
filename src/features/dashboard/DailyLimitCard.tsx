import type { Customer } from '../../api/types'
import { getRemainingDailyLimit } from '../../lib/accounts'
import { formatMoney } from '../../lib/format'

export function DailyLimitCard({ customer }: { customer: Customer }) {
  const limit = customer.dailyTransferLimit
  const used = customer.transferredToday
  const usedPercent = limit > 0 ? Math.min(100, (used / limit) * 100) : 0

  return (
    <section className="card daily-limit" aria-labelledby="daily-limit-title">
      <h2 id="daily-limit-title" className="section-title">
        Daily limit
      </h2>
      <p className="daily-limit-remaining">
        <span className="amount">{formatMoney(getRemainingDailyLimit(customer))}</span>
        remaining today
      </p>
      <div
        className="progress"
        role="progressbar"
        aria-label="Daily limit used"
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={used}
        aria-valuetext={`${formatMoney(used)} of ${formatMoney(limit)} used`}
      >
        <span className="progress-bar" style={{ width: `${usedPercent}%` }} />
      </div>
      <p className="daily-limit-note">Resets daily. Applies to all transfers.</p>
    </section>
  )
}
