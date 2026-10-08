import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { Link } from 'react-router-dom'
import {
  MicVocal, BookOpen, Sparkles, CheckCircle2, ChevronRight,
  Code2, Database, Shield, Layers, HelpCircle, ArrowRight,
  Compass, Lightbulb, Play
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { QUESTION_BANK } from '../api/interviewApi'

const PREP_ROLES = ['Full Stack Developer', 'Frontend Engineer', 'Backend Engineer']

const TOPIC_CHEAT_SHEETS = [
  {
    title: 'System Design & Scalability',
    icon: Layers,
    concepts: ['Load Balancing (Round Robin, Least Connections)', 'Caching Strategies (Cache-Aside, Write-Through)', 'Database Sharding & Read Replicas', 'Asynchronous Queues & Event-Driven Architecture'],
  },
  {
    title: 'API Design & Security',
    icon: Shield,
    concepts: ['REST vs GraphQL vs gRPC trade-offs', 'OWASP Top 10 mitigation (SQLi, XSS, CSRF, BOLA)', 'Rate Limiting (Token Bucket / Leaky Bucket)', 'JWT Lifecycle & HttpOnly Cookie storage'],
  },
  {
    title: 'State & Frontend Performance',
    icon: Code2,
    concepts: ['React Fiber diffing & reconciliation', 'Core Web Vitals optimization (LCP, INP, CLS)', 'Server-Side Rendering (SSR) hydration lifecycle', 'Memory leaks in event listeners & cleanup'],
  },
  {
    title: 'Database Architecture',
    icon: Database,
    concepts: ['ACID Transactions & Isolation Levels', 'B-Tree vs LSM-Tree storage engines', 'Indexing rules & composite leftmost prefix', 'Denormalization vs 3NF normalization'],
  },
]

export function InterviewPreparation() {
  const [selectedRole, setSelectedRole] = useState('Full Stack Developer')
  const [starInput, setStarInput] = useState({
    situation: '',
    task: '',
    action: '',
    result: '',
  })

  const roleQuestions = QUESTION_BANK[selectedRole]?.technical || []

  return (
    <div className="p-6 md:p-8 min-h-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <MicVocal className="w-4 h-4" />
            </span>
            <Badge variant="brand" className="text-xs font-semibold uppercase tracking-wider">
              Technical Interview Mastery
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-text-primary">
            Interview Preparation Hub
          </h1>
          <p className="text-sm text-dark-text-muted mt-1 max-w-2xl">
            Master high-frequency engineering questions, architectural cheat sheets,
            and structure winning behavioral answers using the interactive STAR method coach.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/app/hr-questions">
            <Button variant="outline" size="sm" className="gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>HR Questions</span>
            </Button>
          </Link>
          <Link to="/app/mock-interview">
            <Button variant="primary" size="sm" className="gap-1.5 shadow-lg shadow-brand-500/20">
              <Play className="w-4 h-4" />
              <span>Launch Mock Interview</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Role Selection Bar */}
      <Card className="p-4 flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider">
          Select Target Track:
        </span>
        <div className="flex flex-wrap gap-2">
          {PREP_ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRole(r)}
              className={clsx(
                'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
                selectedRole === r
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-dark-bg/60 text-dark-text-secondary hover:text-dark-text-primary border border-dark-border'
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </Card>

      {/* Main Grid: Architectural Cheatsheets & Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: High Frequency Questions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-dark-text-primary flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-400" /> High-Frequency Questions ({selectedRole})
            </h3>
            <span className="text-xs text-dark-text-muted">Expected in top-tier interviews</span>
          </div>

          <div className="space-y-3">
            {roleQuestions.map((q, idx) => (
              <Card key={q.id} className="p-4 space-y-3 hover:border-brand-500/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-brand-400 uppercase tracking-wider">
                      {q.category} • Question #{idx + 1}
                    </span>
                    <h4 className="text-sm font-semibold text-dark-text-primary leading-snug">
                      {q.question}
                    </h4>
                  </div>
                </div>

                <div className="pt-2 border-t border-dark-border/40 space-y-1.5">
                  <span className="text-[11px] font-semibold text-dark-text-muted">Key Architectural Concepts to Mention:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {q.sampleKeyPoints.map((pt, pi) => (
                      <div key={pi} className="text-xs text-dark-text-secondary flex items-start gap-1.5">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Architectural Cheat Sheets & STAR Coach */}
        <div className="lg:col-span-5 space-y-6">
          {/* Architectural Cheat Sheets */}
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-dark-text-primary flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-400" /> Essential Architecture Cheat Sheets
            </h3>

            <div className="space-y-3">
              {TOPIC_CHEAT_SHEETS.map((topic, i) => {
                const Icon = topic.icon
                return (
                  <div key={i} className="p-3.5 rounded-xl bg-dark-bg/60 border border-dark-border space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-dark-text-primary">
                      <Icon className="w-4 h-4 text-brand-400" />
                      <span>{topic.title}</span>
                    </div>
                    <ul className="space-y-1 text-xs text-dark-text-secondary">
                      {topic.concepts.map((c, ci) => (
                        <li key={ci} className="flex items-start gap-1.5">
                          <span className="text-brand-400">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Interactive STAR Coach Card */}
          <Card className="p-5 space-y-4 bg-gradient-to-br from-dark-card to-accent-950/20 border-accent-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-400" />
                <h3 className="text-sm font-bold text-dark-text-primary">STAR Method Framework Coach</h3>
              </div>
              <Badge variant="accent" className="text-[10px]">Behavioral Secret</Badge>
            </div>
            <p className="text-xs text-dark-text-muted">
              Structure any behavioral or project story with precision:
            </p>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block text-accent-400 font-semibold mb-0.5">S — Situation</label>
                <input
                  type="text"
                  value={starInput.situation}
                  onChange={(e) => setStarInput({ ...starInput, situation: e.target.value })}
                  placeholder="What was the business context or technical challenge?"
                  className="w-full bg-dark-bg border border-dark-border rounded px-2.5 py-1.5 text-dark-text-primary"
                />
              </div>

              <div>
                <label className="block text-info-400 font-semibold mb-0.5">T — Task</label>
                <input
                  type="text"
                  value={starInput.task}
                  onChange={(e) => setStarInput({ ...starInput, task: e.target.value })}
                  placeholder="What specific responsibility did you hold?"
                  className="w-full bg-dark-bg border border-dark-border rounded px-2.5 py-1.5 text-dark-text-primary"
                />
              </div>

              <div>
                <label className="block text-warning-400 font-semibold mb-0.5">A — Action</label>
                <input
                  type="text"
                  value={starInput.action}
                  onChange={(e) => setStarInput({ ...starInput, action: e.target.value })}
                  placeholder="What specific engineering decisions did you take?"
                  className="w-full bg-dark-bg border border-dark-border rounded px-2.5 py-1.5 text-dark-text-primary"
                />
              </div>

              <div>
                <label className="block text-emerald-400 font-semibold mb-0.5">R — Result</label>
                <input
                  type="text"
                  value={starInput.result}
                  onChange={(e) => setStarInput({ ...starInput, result: e.target.value })}
                  placeholder="Quantifiable metric outcome (e.g. 40% latency reduction)?"
                  className="w-full bg-dark-bg border border-dark-border rounded px-2.5 py-1.5 text-dark-text-primary"
                />
              </div>
            </div>

            <Button
              variant="secondary"
              size="xs"
              onClick={() =>
                setStarInput({
                  situation: 'Our checkout API was dropping 12% of requests during peak traffic.',
                  task: 'I was tasked with identifying the bottleneck and preventing checkout failures.',
                  action: 'I profiled database queries, added Redis caching for product catalog lookups, and implemented exponential backoff.',
                  result: 'Eliminated dropped orders completely and reduced p95 latency from 850ms to 120ms.',
                })
              }
              className="text-xs text-brand-400 w-full"
            >
              Fill Example STAR Story
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
