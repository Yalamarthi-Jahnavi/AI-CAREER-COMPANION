import { isValidElement } from 'react'
import { clsx } from 'clsx'

function renderIconElement(iconItem, defaultClassName = 'w-4 h-4 shrink-0') {
  if (!iconItem) return null
  if (isValidElement(iconItem)) {
    return iconItem
  }
  if (typeof iconItem === 'function' || (typeof iconItem === 'object' && iconItem !== null)) {
    const IconComponent = iconItem
    return <IconComponent className={defaultClassName} />
  }
  return iconItem
}

/**
 * Button — Primary UI action component.
 *
 * Props:
 *   variant  - 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
 *   size     - 'sm' | 'md' | 'lg'
 *   loading  - boolean
 *   disabled - boolean
 *   icon     - React element (left icon)
 *   iconRight - React element (right icon)
 *   fullWidth - boolean
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconRight,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 select-none active:scale-95'

  const variants = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    secondary:
      'bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 hover:text-slate-900',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-md',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md',
    outline:
      'border border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        renderIconElement(icon)
      )}
      {children}
      {!loading && renderIconElement(iconRight)}
    </button>
  )
}
