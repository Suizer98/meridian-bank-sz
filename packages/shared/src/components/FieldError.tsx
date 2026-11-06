interface FieldErrorProps {
  id: string
  message?: string
}

export function describedBy(
  ...ids: Array<string | false | undefined>
): string | undefined {
  const value = ids.filter(Boolean).join(' ')
  return value || undefined
}

export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null
  return (
    <p id={id} className="field-error">
      {message}
    </p>
  )
}
