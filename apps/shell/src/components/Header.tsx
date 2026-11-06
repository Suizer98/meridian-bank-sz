import { useCustomer } from '@shared/api/queries'
import { SegmentSwitch } from '@/features/preferences/SegmentSwitch'
import { ThemeToggle } from '@/features/preferences/ThemeToggle'

const HOME_URL = import.meta.env.BASE_URL
const OUT_OF_SCOPE_PAGES = ['Cards', 'Payments', 'Insights']

export function Header() {
  const customer = useCustomer()

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <a className="brand" href={HOME_URL}>
          <span className="brand-mark" aria-hidden="true">
            M
          </span>
          Meridian
        </a>

        <nav className="site-nav" aria-label="Main">
          <ul>
            <li>
              <a href={HOME_URL} aria-current="page">
                Overview
              </a>
            </li>
            {OUT_OF_SCOPE_PAGES.map((label) => (
              <li key={label}>
                <a role="link" aria-disabled="true">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <SegmentSwitch className="segment-switch-header" />
          <ThemeToggle />
          {customer.data ? (
            <span
              className="avatar"
              role="img"
              aria-label={`${customer.data.firstName} ${customer.data.lastName}`}
            >
              {customer.data.firstName[0]}
              {customer.data.lastName[0]}
            </span>
          ) : (
            <span className="avatar" aria-hidden="true" />
          )}
        </div>
      </div>
    </header>
  )
}
