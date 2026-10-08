import { clsx } from 'clsx'

/**
 * Avatar — User avatar with image fallback to initials.
 * size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 */
export function Avatar({ src, name, size = 'md', className = '', online = false }) {
  const initials = name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-14 h-14 text-lg',
  }

  const dotSizes = {
    xs: 'w-1.5 h-1.5 bottom-0 right-0',
    sm: 'w-2 h-2 bottom-0 right-0',
    md: 'w-2.5 h-2.5 bottom-0 right-0',
    lg: 'w-3 h-3 bottom-0.5 right-0.5',
    xl: 'w-3.5 h-3.5 bottom-0.5 right-0.5',
  }

  return (
    <div className={clsx('relative inline-flex shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name || 'User avatar'}
          className={clsx('rounded-full object-cover ring-2 ring-dark-border', sizes[size])}
        />
      ) : (
        <div
          className={clsx(
            'rounded-full flex items-center justify-center font-semibold',
            'bg-brand-gradient text-white ring-2 ring-dark-border',
            sizes[size]
          )}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
          }}
          aria-label={name || 'User'}
        >
          {initials}
        </div>
      )}
      {online && (
        <span
          className={clsx(
            'absolute rounded-full bg-success-500 border-2 border-dark-bg',
            dotSizes[size]
          )}
        />
      )}
    </div>
  )
}
