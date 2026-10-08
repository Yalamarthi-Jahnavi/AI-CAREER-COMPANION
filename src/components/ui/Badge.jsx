import { clsx } from 'clsx'

/**
 * Badge — Status and tag component.
 * variant: 'brand' | 'success' | 'warning' | 'error' | 'muted' | 'accent'
 * dot     — show colored dot before text
 */
export function Badge({ children, variant = 'brand', dot = false, className = '' }) {
  const variants = {
    brand:   'bg-indigo-50   text-indigo-700   border border-indigo-200',
    success: 'bg-emerald-50  text-emerald-700  border border-emerald-200',
    warning: 'bg-amber-50    text-amber-700    border border-amber-200',
    error:   'bg-rose-50     text-rose-700     border border-rose-200',
    muted:   'bg-slate-100   text-slate-500    border border-slate-200',
    accent:  'bg-purple-50   text-purple-700   border border-purple-200',
    info:    'bg-blue-50     text-blue-700     border border-blue-200',
  }

  const dotColors = {
    brand:   'bg-brand-400',
    success: 'bg-success-400',
    warning: 'bg-warning-400',
    error:   'bg-error-400',
    muted:   'bg-surface-400',
    accent:  'bg-accent-400',
    info:    'bg-info-400',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])} />
      )}
      {children}
    </span>
  )
}
