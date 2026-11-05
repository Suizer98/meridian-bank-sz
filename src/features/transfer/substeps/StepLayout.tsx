import type { FormEventHandler, ReactNode } from 'react'

interface StepLayoutProps {
  title: string
  alert?: string
  onSubmit: FormEventHandler<HTMLFormElement>
  footer: ReactNode
  children: ReactNode
}

export function StepLayout({ title, alert, onSubmit, footer, children }: StepLayoutProps) {
  return (
    <form className="dialog-form" onSubmit={onSubmit} noValidate>
      <div className="dialog-body">
        <h3 className="step-title" tabIndex={-1} data-step-heading>
          {title}
        </h3>
        {alert && (
          <div className="alert" role="alert">
            <p>{alert}</p>
          </div>
        )}
        {children}
      </div>
      <div className="dialog-footer">{footer}</div>
    </form>
  )
}
