export function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="card dashboard-error">
      <p role="alert" className="dashboard-error-title">
        We couldn't load your dashboard.
      </p>
      <button type="button" className="button button-primary" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}
