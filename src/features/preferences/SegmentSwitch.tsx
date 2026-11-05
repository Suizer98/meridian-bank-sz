import type { Segment } from '../../api/types'
import { usePreferences } from './PreferencesProvider'

const SEGMENTS: Array<{ value: Segment; label: string }> = [
  { value: 'retail', label: 'Retail' },
  { value: 'premium', label: 'Premium' },
]

export function SegmentSwitch({ className }: { className?: string }) {
  const { segment, setSegment } = usePreferences()

  return (
    <div
      role="group"
      aria-label="Customer segment"
      className={className ? `segment-switch ${className}` : 'segment-switch'}
    >
      {SEGMENTS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={segment === option.value}
          onClick={() => setSegment(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
