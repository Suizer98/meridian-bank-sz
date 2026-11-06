import { useEffect } from 'react'
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

export function useServerErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  fields: Partial<Record<Path<T>, string>> | undefined,
) {
  useEffect(() => {
    if (!fields) return
    const entries = Object.entries(fields) as Array<[Path<T>, string]>
    entries.forEach(([name, message], index) => {
      setError(name, { type: 'server', message }, { shouldFocus: index === 0 })
    })
  }, [fields, setError])
}
