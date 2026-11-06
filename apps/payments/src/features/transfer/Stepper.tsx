const STEPS = [
  { id: 'recipient', label: 'Recipient' },
  { id: 'amount', label: 'Amount' },
  { id: 'review', label: 'Review' },
] as const

export type TransferStep = (typeof STEPS)[number]['id']

export function Stepper({ current }: { current: TransferStep }) {
  const currentIndex = STEPS.findIndex((step) => step.id === current)

  return (
    <ol className="stepper" aria-label="Transfer progress">
      {STEPS.map((step, index) => (
        <li
          key={step.id}
          className={index < currentIndex ? 'is-complete' : undefined}
          aria-current={index === currentIndex ? 'step' : undefined}
        >
          {index > 0 && (
            <span className="stepper-arrow" aria-hidden="true">
              →
            </span>
          )}
          <span className="stepper-index" aria-hidden="true">
            {index + 1}
          </span>
          {step.label}
        </li>
      ))}
    </ol>
  )
}
