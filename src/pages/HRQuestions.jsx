import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { Link } from 'react-router-dom'
import {
  HelpCircle, Sparkles, Bookmark, BookmarkCheck, ChevronDown,
  ChevronUp, Play, CheckCircle2, AlertTriangle, Lightbulb,
  MessageSquare, User, ArrowRight, Award, DollarSign
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { useInterviewStore } from '../store/useInterviewStore'
import { HR_QUESTIONS } from '../api/interviewApi'

const CATEGORIES = [
  { id: 'all', label: 'All HR Questions' },
  { id: 'intro', label: 'Introduction & Story' },
  { id: 'conflict', label: 'Conflict & Collaboration' },
  { id: 'leadership', label: 'Ownership & Initiative' },
  { id: 'pressure', label: 'Pressure & Outages' },
  { id: 'negotiation', label: 'Career & Expectations' },
]

export function HRQuestions() {
  const {
    selectedHrCategory,
    setHrCategory,
    savedHrQuestions,
    toggleSaveHrQuestion,
    starDrafts,
    updateStarDraft,
  } = useInterviewStore()

  const [expandedId, setExpandedId] = useState('hr-1')
  const [activeDraftTab, setActiveDraftTab] = useState({}) // { [qId]: boolean }

  const filteredQuestions = selectedHrCategory === 'all'
    ? HR_QUESTIONS
    : HR_QUESTIONS.filter((q) => q.category === selectedHrCategory)

  return (
    <div className="p-6 md:p-8 min-h-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-success-500/10 text-success-400 border border-success-500/20">
              <HelpCircle className="w-4 h-4" />
            </span>
            <Badge variant="success" className="text-xs font-semibold uppercase tracking-wider">
              Behavioral & Culture Fit
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-text-primary">
            HR Question Generator & Trainer
          </h1>
          <p className="text-sm text-dark-text-muted mt-1 max-w-2xl">
            Master the most critical behavioral and HR interview questions. Understand what recruiters
            are really screening for, avoid common pitfalls, and study winning sample answers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/app/mock-interview">
            <Button variant="primary" size="sm" className="gap-1.5 shadow-lg shadow-brand-500/20">
              <Play className="w-4 h-4" />
              <span>Practice in Mock Interview</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none p-1.5 bg-dark-card border border-dark-border rounded-xl">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setHrCategory(cat.id)}
            className={clsx(
              'px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
              selectedHrCategory === cat.id
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-dark-text-muted hover:text-dark-text-primary'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const isExpanded = expandedId === q.id
          const isSaved = savedHrQuestions.some((sq) => sq.id === q.id)
          const draft = starDrafts[q.id] || { situation: '', task: '', action: '', result: '' }

          return (
            <Card key={q.id} className="overflow-hidden border-dark-border transition-all">
              {/* Question Bar */}
              <div
                className="p-5 flex items-start justify-between gap-4 cursor-pointer bg-dark-card hover:bg-dark-bg/60 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="brand" className="text-[10px] font-semibold">
                      {q.categoryLabel}
                    </Badge>
                    {isSaved && <Badge variant="success" className="text-[10px]">Saved</Badge>}
                  </div>
                  <h3 className="text-base font-bold text-dark-text-primary">
                    {q.question}
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => toggleSaveHrQuestion(q)}
                    className="p-2 rounded-lg text-dark-text-muted hover:text-brand-400 hover:bg-dark-bg transition-colors"
                    title={isSaved ? 'Remove from saved' : 'Save question'}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4 text-brand-400" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="p-2 rounded-lg text-dark-text-muted hover:text-dark-text-primary transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-dark-border p-5 bg-dark-bg/40 space-y-5"
                  >
                    {/* Two-Column: What HR looks for vs Pitfalls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-success-500/10 border border-success-500/20 space-y-1.5">
                        <span className="font-bold text-success-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> What HR is Really Looking For:
                        </span>
                        <p className="text-dark-text-secondary leading-relaxed">
                          {q.whatHrLooksFor}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-error-500/10 border border-error-500/20 space-y-1.5">
                        <span className="font-bold text-error-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                          <AlertTriangle className="w-3.5 h-3.5" /> Common Pitfalls to Avoid:
                        </span>
                        <p className="text-dark-text-secondary leading-relaxed">
                          {q.pitfalls}
                        </p>
                      </div>
                    </div>

                    {/* STAR Framework Structure */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
                        STAR Structure Template:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-3 rounded-lg bg-dark-card border border-dark-border">
                          <span className="font-bold text-accent-400">Situation: </span>
                          <span className="text-dark-text-secondary">{q.starGuide.situation}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-dark-card border border-dark-border">
                          <span className="font-bold text-info-400">Task: </span>
                          <span className="text-dark-text-secondary">{q.starGuide.task}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-dark-card border border-dark-border">
                          <span className="font-bold text-warning-400">Action: </span>
                          <span className="text-dark-text-secondary">{q.starGuide.action}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-dark-card border border-dark-border">
                          <span className="font-bold text-emerald-400">Result: </span>
                          <span className="text-dark-text-secondary">{q.starGuide.result}</span>
                        </div>
                      </div>
                    </div>

                    {/* Winning Sample Answer */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Winning Sample Answer:
                      </span>
                      <div className="p-4 rounded-xl bg-dark-card border border-dark-border text-xs text-dark-text-secondary leading-relaxed font-sans italic">
                        "{q.sampleAnswer}"
                      </div>
                    </div>

                    {/* Interactive Answer Drafter */}
                    <div className="space-y-3 pt-3 border-t border-dark-border">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-dark-text-primary flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-brand-400" /> Draft Your STAR Response
                        </span>
                        <span className="text-dark-text-muted text-[11px]">Saved automatically</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <input
                          type="text"
                          value={draft.situation}
                          onChange={(e) => updateStarDraft(q.id, 'situation', e.target.value)}
                          placeholder="Situation: Context..."
                          className="w-full bg-dark-card border border-dark-border rounded px-3 py-1.5 text-dark-text-primary"
                        />
                        <input
                          type="text"
                          value={draft.task}
                          onChange={(e) => updateStarDraft(q.id, 'task', e.target.value)}
                          placeholder="Task: My goal..."
                          className="w-full bg-dark-card border border-dark-border rounded px-3 py-1.5 text-dark-text-primary"
                        />
                        <input
                          type="text"
                          value={draft.action}
                          onChange={(e) => updateStarDraft(q.id, 'action', e.target.value)}
                          placeholder="Action: Engineering steps taken..."
                          className="w-full bg-dark-card border border-dark-border rounded px-3 py-1.5 text-dark-text-primary"
                        />
                        <input
                          type="text"
                          value={draft.result}
                          onChange={(e) => updateStarDraft(q.id, 'result', e.target.value)}
                          placeholder="Result: Quantifiable metric outcome..."
                          className="w-full bg-dark-card border border-dark-border rounded px-3 py-1.5 text-dark-text-primary"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
