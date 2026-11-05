interface SkeletonProps {
  width?: number | string
  height?: number | string
  radius?: string
}

export function Skeleton({ width = '100%', height = 16, radius }: SkeletonProps) {
  return (
    <span
      className="skeleton"
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  )
}
