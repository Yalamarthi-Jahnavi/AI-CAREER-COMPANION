import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Sparkles, ArrowLeft, Construction } from 'lucide-react'

/**
 * PlaceholderPage — Generic placeholder for features in development.
 * Accepts: title, icon, description, color, features[]
 */
export function PlaceholderPage({
  title,
  icon: Icon = Construction,
  description,
  color = 'brand',
  features = [],
  primaryAction,
  primaryActionLabel = 'Notify Me',
}) {
  const navigate = useNavigate()

  const colorConfig = {
    brand:   { gradient: 'from-brand-500/20 to-brand-700/5',   icon: 'text-brand-400',   border: 'border-brand-500/20',   glow: 'rgba(99,102,241,0.15)' },
    accent:  { gradient: 'from-accent-500/20 to-accent-700/5', icon: 'text-accent-400',  border: 'border-accent-500/20',  glow: 'rgba(217,70,239,0.15)' },
    success: { gradient: 'from-success-500/20 to-success-700/5', icon: 'text-success-400', border: 'border-success-500/20', glow: 'rgba(34,197,94,0.15)' },
    warning: { gradient: 'from-warning-500/20 to-warning-700/5', icon: 'text-warning-400', border: 'border-warning-500/20', glow: 'rgba(234,179,8,0.15)' },
    info:    { gradient: 'from-info-500/20 to-info-700/5',    icon: 'text-info-400',    border: 'border-info-500/20',    glow: 'rgba(59,130,246,0.15)' },
    error:   { gradient: 'from-error-500/20 to-error-700/5',  icon: 'text-error-400',   border: 'border-error-500/20',   glow: 'rgba(239,68,68,0.15)' },
  }

  const c = colorConfig[color] || colorConfig.brand

  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`w-full max-w-2xl bg-dark-card border ${c.border} rounded-3xl p-10 text-center relative overflow-hidden`}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${c.glow} 0%, transparent 60%)` }}
        />

        {/* Content */}
        <div className="relative">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <Badge variant={color} dot>Coming Soon</Badge>
          </div>

          {/* Icon */}
          <div className={`inline-flex p-5 rounded-2xl mb-6 bg-gradient-to-br ${c.gradient} border ${c.border}`}>
            <Icon className={`w-10 h-10 ${c.icon}`} />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black text-white mb-3">{title}</h1>

          {/* Description */}
          {description && (
            <p className="text-surface-400 text-base leading-relaxed mb-8 max-w-md mx-auto">
              {description}
            </p>
          )}

          {/* Feature Preview */}
          {features.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 + 0.2 }}
                  className="flex items-start gap-3 p-3.5 bg-dark-bg border border-dark-border rounded-xl"
                >
                  <Sparkles className={`w-4 h-4 ${c.icon} shrink-0 mt-0.5`} />
                  <span className="text-sm text-surface-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={primaryAction || (() => {})}
            >
              {primaryActionLabel}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
