import { AlertCircle, RefreshCw, Inbox, Search, Lock, Wifi, FileX } from 'lucide-react'
import { Button } from './Button'

/**
 * EmptyState — Shown when a page/section has no content yet.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description = 'Get started by adding your first item.',
  action,
  actionLabel,
  secondaryAction,
  secondaryActionLabel,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}>
      <div className="p-4 rounded-2xl bg-dark-muted border border-dark-border mb-4">
        <Icon className="w-8 h-8 text-surface-500" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-surface-400 text-sm max-w-sm leading-relaxed mb-6">{description}</p>
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button onClick={action} variant="primary" size="sm">
              {actionLabel || 'Get Started'}
            </Button>
          )}
          {secondaryAction && (
            <Button onClick={secondaryAction} variant="ghost" size="sm">
              {secondaryActionLabel || 'Learn More'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * ErrorState — Shown when a page fails to load.
 */
export function ErrorState({
  title = 'Something went wrong',
  description = 'We encountered an error loading this content.',
  error,
  onRetry,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}>
      <div className="p-4 rounded-2xl bg-error-500/10 border border-error-500/20 mb-4">
        <AlertCircle className="w-8 h-8 text-error-400" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-surface-400 text-sm max-w-sm leading-relaxed mb-2">{description}</p>
      {error && (
        <code className="text-xs text-error-400/70 bg-error-500/5 px-3 py-1 rounded-lg mb-6 max-w-sm truncate">
          {error}
        </code>
      )}
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" size="sm" icon={<RefreshCw className="w-4 h-4" />}>
          Try Again
        </Button>
      )}
    </div>
  )
}

/**
 * SearchEmptyState — Shown when a search returns no results.
 */
export function SearchEmptyState({ query = '', onClear }) {
  return (
    <EmptyState
      icon={Search}
      title={`No results for "${query}"`}
      description="Try adjusting your search terms or filters."
      action={onClear}
      actionLabel="Clear Search"
    />
  )
}

/**
 * NetworkErrorState — Shown on network failures.
 */
export function NetworkErrorState({ onRetry }) {
  return (
    <EmptyState
      icon={Wifi}
      title="Connection Error"
      description="Unable to reach the server. Check your internet connection and try again."
      action={onRetry}
      actionLabel="Retry"
    />
  )
}

/**
 * UnauthorizedState — Shown on 403 errors.
 */
export function UnauthorizedState() {
  return (
    <EmptyState
      icon={Lock}
      title="Access Restricted"
      description="You don't have permission to view this content. Upgrade your plan to unlock."
      actionLabel="Upgrade Plan"
    />
  )
}

/**
 * NotFoundState — Shown when a resource doesn't exist.
 */
export function NotFoundState({ onBack }) {
  return (
    <EmptyState
      icon={FileX}
      title="Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
      action={onBack}
      actionLabel="Go Back"
    />
  )
}
