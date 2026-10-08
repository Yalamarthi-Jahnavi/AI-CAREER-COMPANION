import { clsx } from 'clsx'

/**
 * Skeleton — Shimmer loading placeholder.
 * Use to replace content while data loads.
 */
export function Skeleton({ className = '', rounded = 'md', ...props }) {
  const radii = {
    sm:   'rounded',
    md:   'rounded-lg',
    lg:   'rounded-xl',
    xl:   'rounded-2xl',
    full: 'rounded-full',
  }

  return (
    <div
      className={clsx(
        'bg-dark-muted overflow-hidden relative',
        radii[rounded],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 shimmer-bg" />
    </div>
  )
}

/**
 * SkeletonCard — Preset skeleton for a stat card layout.
 */
export function SkeletonCard() {
  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <Skeleton className="w-10 h-10" rounded="xl" />
        <Skeleton className="w-12 h-5" rounded="full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-20 h-7" rounded="md" />
        <Skeleton className="w-32 h-4" rounded="md" />
      </div>
    </div>
  )
}

/**
 * SkeletonList — Skeleton for a list of items.
 */
export function SkeletonList({ count = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 bg-dark-card border border-dark-border rounded-xl">
          <Skeleton className="w-10 h-10 shrink-0" rounded="full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-3/4 h-4" rounded="md" />
            <Skeleton className="w-1/2 h-3" rounded="md" />
          </div>
          <Skeleton className="w-16 h-6" rounded="full" />
        </div>
      ))}
    </div>
  )
}

/**
 * Spinner — Loading spinner component.
 */
export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-2',
    xl: 'w-12 h-12 border-3',
  }

  return (
    <div
      className={clsx(
        'rounded-full border-brand-500 border-t-transparent animate-spin',
        sizes[size],
        className
      )}
      role="status"
      aria-label="Loading..."
    />
  )
}

/**
 * LoadingOverlay — Full-page loading state.
 */
export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative">
        <Spinner size="xl" />
        <div className="absolute inset-0 rounded-full border-2 border-brand-500/20 animate-ping" />
      </div>
      <p className="text-surface-400 text-sm animate-pulse">{message}</p>
    </div>
  )
}
