import { Plus } from 'lucide-react'
import { formatMoney } from '@shared/lib/format'

interface BalanceHeroProps {
  total: number
  depositAccountCount: number
  onNewTransfer: () => void
}

export function BalanceHero({ total, depositAccountCount, onNewTransfer }: BalanceHeroProps) {
  return (
    <section className="balance-hero" aria-labelledby="balance-hero-title">
      <div>
        <h2 id="balance-hero-title" className="balance-hero-label">
          Total available
        </h2>
        <p className="balance-hero-amount amount">{formatMoney(total)}</p>
        <p className="balance-hero-caption">
          Across {depositAccountCount} deposit{' '}
          {depositAccountCount === 1 ? 'account' : 'accounts'}
        </p>
      </div>
      <button type="button" className="button button-primary new-transfer-button" onClick={onNewTransfer}>
        <Plus size={20} aria-hidden="true" />
        New transfer
      </button>
    </section>
  )
}
