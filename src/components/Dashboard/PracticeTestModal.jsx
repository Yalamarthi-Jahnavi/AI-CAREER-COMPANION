import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  X,
  Play,
  Sparkles,
  CheckCircle,
  Clock,
  Code2,
  Cpu,
  Layers,
  Award,
  ChevronRight,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import toast from 'react-hot-toast'

const TECH_OPTIONS = [
  { id: 'python', name: 'Python', questions: 25, difficulty: 'Intermediate', color: '#38bdf8' },
  { id: 'react', name: 'React', questions: 30, difficulty: 'Advanced', color: '#60a5fa' },
  { id: 'aws', name: 'AWS Cloud', questions: 20, difficulty: 'Architect', color: '#fbbf24' },
  { id: 'docker', name: 'Docker', questions: 20, difficulty: 'Intermediate', color: '#0ea5e9' },
  { id: 'sql', name: 'SQL Querying', questions: 25, difficulty: 'Advanced', color: '#a855f7' },
  { id: 'system-design', name: 'System Design', questions: 15, difficulty: 'High Scale', color: '#f43f5e' },
]

export function PracticeTestModal({ isOpen, onClose, initialTech }) {
  const navigate = useNavigate()
  const [selectedTech, setSelectedTech] = useState(initialTech?.id || 'react')
  const [duration, setDuration] = useState('20')
  const [difficulty, setDifficulty] = useState('Adaptive AI')
  const [isStarting, setIsStarting] = useState(false)

  if (!isOpen) return null

  const handleStartTest = () => {
    setIsStarting(true)
    setTimeout(() => {
      setIsStarting(false)
      onClose()
      toast.success(`Starting ${selectedTech.toUpperCase()} Practice Assessment!`)
      navigate('/app/current-technology-practice')
    }, 600)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-dark-card border border-dark-border rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Top banner */}
          <div className="p-6 border-b border-dark-border bg-gradient-to-r from-brand-950/60 via-dark-card to-accent-950/40 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Start Technology Practice Test
                    <Badge variant="brand" size="sm">AI Evaluated</Badge>
                  </h3>
                  <p className="text-xs text-surface-400">
                    Timed challenge tailored to your current progress & target job readiness
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-dark-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Tech Selector */}
            <div>
              <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider block mb-3">
                Choose Practice Technology
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TECH_OPTIONS.map((t) => {
                  const isSelected = selectedTech === t.id
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTech(t.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all relative ${
                        isSelected
                          ? 'bg-brand-600/15 border-brand-500 text-white shadow-sm ring-1 ring-brand-500/50'
                          : 'bg-dark-surface/60 border-dark-border text-surface-300 hover:border-surface-600 hover:bg-dark-surface'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{t.name}</span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-brand-400" />}
                      </div>
                      <div className="text-[11px] text-surface-400 flex items-center justify-between">
                        <span>{t.questions} questions</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-muted text-surface-400">
                          {t.difficulty}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Test Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Duration */}
              <div className="bg-dark-surface/50 border border-dark-border rounded-xl p-4">
                <span className="text-xs font-medium text-surface-400 flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 text-brand-400" />
                  Test Duration
                </span>
                <div className="flex gap-2">
                  {['15 min', '20 min', '30 min'].map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setDuration(dur.split(' ')[0])}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        duration === dur.split(' ')[0]
                          ? 'bg-brand-500 text-white border-brand-400'
                          : 'bg-dark-muted/60 text-surface-300 border-transparent hover:bg-dark-muted'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode */}
              <div className="bg-dark-surface/50 border border-dark-border rounded-xl p-4">
                <span className="text-xs font-medium text-surface-400 flex items-center gap-1.5 mb-2">
                  <Award className="w-3.5 h-3.5 text-accent-400" />
                  Difficulty Mode
                </span>
                <div className="flex gap-2">
                  {['Standard', 'Adaptive AI', 'Hardcore'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setDifficulty(mode)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        difficulty === mode
                          ? 'bg-accent-500 text-white border-accent-400'
                          : 'bg-dark-muted/60 text-surface-300 border-transparent hover:bg-dark-muted'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Practice Highlights summary */}
            <div className="bg-brand-950/30 border border-brand-500/20 rounded-xl p-3.5 text-xs text-brand-200/90 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <div>
                <strong>AI Scoring Enabled:</strong> Your answers will dynamically calibrate your{' '}
                <span className="text-white font-medium">Technical Skills Score</span> and update your{' '}
                <span className="text-white font-medium">Job Switch Readiness Index</span> upon completion.
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-dark-border bg-dark-surface/40 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              loading={isStarting}
              onClick={handleStartTest}
              icon={Play}
              className="px-6"
            >
              Launch Practice Test Now
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
