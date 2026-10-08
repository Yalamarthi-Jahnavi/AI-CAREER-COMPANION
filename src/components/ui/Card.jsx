import { clsx } from 'clsx'

/**
 * Card — Base surface component with glass morphism and hover effects.
 *
 * Props:
 *   interactive - adds hover lift effect and cursor-pointer
 *   glow        - adds brand glow on hover
 *   padding     - 'none' | 'sm' | 'md' | 'lg'
 *   className   - additional classes
 */
export function Card({
  children,
  interactive = false,
  glow = false,
  padding = 'md',
  className = '',
  onClick,
  ...props
}) {
  const paddings = {
    none: '',
    sm:   'p-4',
    md:   'p-5',
    lg:   'p-6',
    xl:   'p-8',
  }

  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white border border-slate-200/90 rounded-2xl',
        'transition-all duration-300',
        paddings[padding],
        interactive && 'cursor-pointer hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md',
        glow && 'hover:shadow-[0_0_24px_rgba(99,102,241,0.12)] hover:border-indigo-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * StatCard — KPI summary card with icon, value, label, and trend.
 */
export function StatCard({
  icon,
  label,
  value,
  trend,
  trendLabel,
  color = 'brand',
  className = '',
}) {
  const colors = {
    brand:   { bg: 'bg-brand-500/10',   text: 'text-brand-400',   border: 'border-brand-500/20' },
    success: { bg: 'bg-success-500/10', text: 'text-success-400', border: 'border-success-500/20' },
    warning: { bg: 'bg-warning-500/10', text: 'text-warning-400', border: 'border-warning-500/20' },
    error:   { bg: 'bg-error-500/10',   text: 'text-error-400',   border: 'border-error-500/20' },
    info:    { bg: 'bg-info-500/10',    text: 'text-info-400',    border: 'border-info-500/20' },
    accent:  { bg: 'bg-accent-500/10',  text: 'text-accent-400',  border: 'border-accent-500/20' },
  }

  const c = colors[color] || colors.brand
  const isPositive = trend > 0

  return (
    <Card interactive glow className={clsx('flex flex-col gap-4', className)}>
      <div className="flex items-start justify-between">
        <div className={clsx('p-2.5 rounded-xl border', c.bg, c.border)}>
          <span className={clsx('w-5 h-5 flex items-center justify-center', c.text)}>
            {icon ? (
              typeof icon === 'function' || (typeof icon === 'object' && !('props' in icon)) ? (
                (() => {
                  const IconComp = icon
                  return <IconComp className="w-5 h-5" />
                })()
              ) : (
                icon
              )
            ) : null}
          </span>
        </div>
        {trend !== undefined && (
          <span
            className={clsx(
              'text-xs font-semibold px-2 py-1 rounded-full',
              isPositive
                ? 'text-success-400 bg-success-500/10'
                : 'text-error-400 bg-error-500/10'
            )}
          >
            {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
        {trendLabel && (
          <p className="text-xs text-surface-500 mt-1">{trendLabel}</p>
        )}
      </div>
    </Card>
  )
}
