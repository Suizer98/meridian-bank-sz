import { formatMoney } from '@/lib/format'

// Testing Library collapses the non-breaking space Intl puts after "SGD" in the
// page text, but not in the query string, so normalise the query the same way.
export function moneyText(amount: number): string {
  return formatMoney(amount).replace(/\s/g, ' ')
}
