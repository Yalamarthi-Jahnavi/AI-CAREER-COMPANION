import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Users,
  Download,
  Copy,
  Check,
  RotateCcw,
  Mail,
  BookOpen,
  Plus,
  Trash2,
} from 'lucide-react'
import toast from 'react-hot-toast'

const PHASE_ICONS = {
  'phase-1': ShieldCheck,
  'phase-2': Mail,
  'phase-3': BookOpen,
  'phase-4': Users,
}

const DEFAULT_PHASES = [
  {
    id: 'phase-1',
    title: 'Phase 1: Pre-Resignation Safety & Financial Check',
    color: 'blue',
    icon: ShieldCheck,
    items: [
      { id: 'p1-1', task: 'Ensure written, unconditional offer letter is signed by new employer', completed: true },
      { id: 'p1-2', task: 'Verify 4–6 months liquid emergency runway in bank account', completed: true },
      { id: 'p1-3', task: 'Download personal performance reviews, paystubs, and tax forms (W2/Form 16) from HR portal', completed: false },
      { id: 'p1-4', task: 'Review non-compete, IP assignment, and notice period clause in original contract', completed: true },
      { id: 'p1-5', task: 'Ensure medical and life insurance bridge until new company policy kicks in', completed: false },
    ],
  },
  {
    id: 'phase-2',
    title: 'Phase 2: Formal Resignation & Notice Period',
    color: 'amber',
    icon: Mail,
    items: [
      { id: 'p2-1', task: 'Schedule a 15-minute 1:1 with direct manager before sending email', completed: false },
      { id: 'p2-2', task: 'Submit short, polite formal resignation email to HR and Manager with exact Last Working Day (LWD)', completed: false },
      { id: 'p2-3', task: 'Formally request written acceptance of resignation within 48 hours', completed: false },
      { id: 'p2-4', task: 'Establish notice period buyout or early release timeline if applicable', completed: false },
      { id: 'p2-5', task: 'Politely decline counter-offers if your decision to switch is firm', completed: false },
    ],
  },
  {
    id: 'phase-3',
    title: 'Phase 3: Knowledge Transfer & Handover',
    color: 'purple',
    icon: BookOpen,
    items: [
      { id: 'p3-1', task: 'Document architecture diagrams, API endpoints, and production deployment runbooks', completed: false },
      { id: 'p3-2', task: 'Designate primary KT buddy and schedule walkthrough sessions with recorded Loom/Teams demos', completed: false },
      { id: 'p3-3', task: 'Transfer repository ownership, production credentials, and cloud IAM admin rights', completed: false },
      { id: 'p3-4', task: 'Draft comprehensive handover document listing ongoing PRs and Jira issues', completed: false },
    ],
  },
  {
    id: 'phase-4',
    title: 'Phase 4: Exit Formalities & Professional Network',
    color: 'emerald',
    icon: Users,
    items: [
      { id: 'p4-1', task: 'Complete constructive Exit Interview with HR (keep feedback polite and avoid burning bridges)', completed: false },
      { id: 'p4-2', task: 'Request LinkedIn recommendations and peer endorsements from senior colleagues and leads', completed: false },
      { id: 'p4-3', task: 'Obtain official Experience Letter, Relieving Letter, and Full & Final Settlement (F&F) receipt', completed: false },
      { id: 'p4-4', task: 'Return company laptop, access badges, tokens, and monitor hardware cleanly', completed: false },
    ],
  },
]

export function ResignationChecklist() {
  const [phases, setPhases] = useState(() => {
    try {
      const saved = localStorage.getItem('resignation_checklist_phases')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => ({
            ...p,
            icon: PHASE_ICONS[p.id] || ShieldCheck,
          }))
        }
      }
    } catch {}
    return DEFAULT_PHASES
  })

  const [activeFilter, setActiveFilter] = useState('all') // 'all' | 'pending' | 'completed'

  // Calculator State
  const [resignationDate, setResignationDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })
  const [noticePeriodDays, setNoticePeriodDays] = useState(30)
  const [managerName, setManagerName] = useState('Jane Doe')
  const [currentRole, setCurrentRole] = useState('Senior Software Engineer')
  const [companyName, setCompanyName] = useState('Acme Corp')
  const [emailCopied, setEmailCopied] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)

  // Calculate Last Working Day
  const calculateLWD = () => {
    if (!resignationDate) return ''
    const date = new Date(resignationDate)
    date.setDate(date.getDate() + Number(noticePeriodDays))
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Persist to localStorage (strip icon function reference)
  useEffect(() => {
    try {
      const clean = phases.map(({ icon, ...rest }) => rest)
      localStorage.setItem('resignation_checklist_phases', JSON.stringify(clean))
    } catch (e) {
      console.warn('Failed to persist checklist state', e)
    }
  }, [phases])

  const [newTaskTexts, setNewTaskTexts] = useState({}) // { [phaseId]: string }
  const [activeAddingPhase, setActiveAddingPhase] = useState(null)

  const toggleTask = (phaseId, taskId) => {
    setPhases((prevPhases) =>
      prevPhases.map((phase) => {
        if (phase.id !== phaseId) return phase
        return {
          ...phase,
          items: phase.items.map((item) => {
            if (item.id === taskId) {
              const nextState = !item.completed
              if (nextState) {
                toast.success('Task marked as completed! 🎉')
              }
              return { ...item, completed: nextState }
            }
            return item
          }),
        }
      })
    )
  }

  const addTask = (phaseId) => {
    const text = newTaskTexts[phaseId]?.trim()
    if (!text) return
    const newItem = {
      id: `task-${Date.now()}`,
      task: text,
      completed: false,
    }
    setPhases((prev) =>
      prev.map((p) => (p.id === phaseId ? { ...p, items: [...p.items, newItem] } : p))
    )
    setNewTaskTexts((prev) => ({ ...prev, [phaseId]: '' }))
    setActiveAddingPhase(null)
    toast.success('Custom checklist task added!')
  }

  const deleteTask = (phaseId, taskId) => {
    setPhases((prev) =>
      prev.map((p) => (p.id === phaseId ? { ...p, items: p.items.filter((i) => i.id !== taskId) } : p))
    )
    toast.success('Task removed from checklist')
  }

  const resetChecklist = () => {
    if (window.confirm('Reset all checklist items to default?')) {
      setPhases(DEFAULT_PHASES)
      localStorage.removeItem('resignation_checklist_phases')
      toast.success('Checklist reset to defaults')
    }
  }

  const allItems = phases.flatMap((p) => p.items)
  const completedCount = allItems.filter((i) => i.completed).length
  const progressPercentage = Math.round((completedCount / (allItems.length || 1)) * 100)

  // Filter items
  const getFilteredItems = (items) => {
    if (activeFilter === 'completed') return items.filter((i) => i.completed)
    if (activeFilter === 'pending') return items.filter((i) => !i.completed)
    return items
  }

  // Generated Resignation Email Template
  const emailTemplate = `Subject: Formal Resignation — ${currentRole} — [Your Name]

Dear ${managerName || 'Manager'},

Please accept this email as formal notification that I am resigning from my position as ${currentRole} at ${companyName}. My last working day will be ${calculateLWD() || '[Last Working Day]'}, in accordance with my ${noticePeriodDays}-day notice period.

I am deeply grateful for the opportunities I have had during my tenure at ${companyName}. I have thoroughly enjoyed working with the team and appreciate the mentorship and support provided to me throughout my time here.

Over the coming weeks, I am fully committed to ensuring a smooth, comprehensive knowledge transfer. I will document all active architectural modules, handover runbooks, and train designated team members to minimize any disruption.

Please let me know the next steps regarding the exit formalities and written acceptance of this resignation.

Thank you again for your guidance and support.

Sincerely,
[Your Name]
[Your Contact Number]
[Your Personal Email]`

  const copyEmail = () => {
    navigator.clipboard.writeText(emailTemplate)
    setEmailCopied(true)
    toast.success('Resignation email copied to clipboard!')
    setTimeout(() => setEmailCopied(false), 2500)
  }

  const downloadEmailTxt = () => {
    const blob = new Blob([emailTemplate], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `Formal_Resignation_Email_${currentRole.replace(/\s+/g, '_')}.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Downloaded resignation email draft (.txt)!')
  }

  // Download Handover Markdown Runbook
  const downloadHandoverDoc = () => {
    const doc = `# Knowledge Transfer & Handover Runbook
**Author:** [Your Name]
**Role:** ${currentRole}
**Company:** ${companyName}
**Effective Notice Period:** ${noticePeriodDays} Days
**Last Working Day:** ${calculateLWD()}

---

## 1. Project & Repository Overview
- **Core Repositories:**
  - \`repo-primary-api\`: Main backend service
  - \`repo-web-client\`: Frontend web application
- **Documentation Confluence/Notion Links:**
  - Architecture Blueprint: [Link]
  - API Specifications: [Link]

## 2. Key Responsibilities & Daily Tasks
- Weekly release deployment orchestration
- Production alert triage & error tracking (Sentry / Datadog)
- PR code reviews & sprint planning

## 3. Designated Knowledge Transfer Buddies
- **Primary KT Buddy:** [Name] (Slack: @buddy1)
- **Secondary KT Buddy:** [Name] (Slack: @buddy2)

## 4. Handover Timeline & Milestone Schedule
- **Week 1:** Architecture walkthroughs & codebase exploration
- **Week 2:** Shadowing session: buddy drives PR reviews while author observes
- **Week 3:** Reverse shadow: buddy deploys while author assists
- **Week 4:** Full handover sign-off & admin permissions revocation

## 5. System Access & Credential Revocation
- [ ] GitHub / GitLab Organization Admin Rights
- [ ] AWS / GCP IAM Role Access
- [ ] Database Admin & VPN Tokens
- [ ] Slack Channels & Third-party SaaS Tools

---
*Generated via AI Career Companion — Professional Exit Hub*`

    const blob = new Blob([doc], { type: 'text/markdown;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `Handover_KT_Runbook_${currentRole.replace(/\s+/g, '_')}.md`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Downloaded Handover Runbook template (.md)!')
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto text-slate-800 font-sans">
      {/* ── Top Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Professional Resignation & Handover Checklist
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
              {completedCount} of {allItems.length} Completed ({progressPercentage}%)
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500">
            Exit professionally without burning bridges, protect your legal rights, calculate exact LWD, and ensure a seamless handover.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowEmailModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Template</span>
          </button>

          <button
            onClick={downloadHandoverDoc}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export KT Plan</span>
          </button>

          <button
            onClick={resetChecklist}
            className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            title="Reset Checklist"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Progress Bar & Interactive Filters ──────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 block">Overall Exit Readiness</span>
            <span className="text-[11px] text-slate-500">
              Complete critical legal and handover milestones before stepping down
            </span>
          </div>
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: `All (${allItems.length})` },
              { id: 'pending', label: `Pending (${allItems.length - completedCount})` },
              { id: 'completed', label: `Completed (${completedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/60">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`h-full rounded-full transition-colors ${
              progressPercentage >= 80
                ? 'bg-emerald-500'
                : progressPercentage >= 40
                ? 'bg-blue-600'
                : 'bg-amber-500'
            }`}
          />
        </div>
      </div>

      {/* ── Notice Period & Last Working Day Calculator ────────────── */}
      <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-sky-50/80 border border-blue-100 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Calendar className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-bold text-slate-900">
              Notice Period & Last Working Day (LWD) Calculator
            </h2>
            <p className="text-[11px] text-slate-500">
              Calculate your exact contractual exit date and handover window
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Resignation Date
            </label>
            <input
              type="date"
              value={resignationDate}
              onChange={(e) => setResignationDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Notice Period Duration
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[15, 30, 45, 60, 90].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setNoticePeriodDays(days)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    noticePeriodDays === days
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {days}d
                </button>
              ))}
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-2xs">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={noticePeriodDays}
                  onChange={(e) => setNoticePeriodDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-xs text-center font-bold text-slate-800 focus:outline-none"
                  placeholder="Custom"
                />
                <span className="text-[10px] text-slate-400 font-semibold">days</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-blue-100 rounded-2xl p-3 flex flex-col justify-center shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
              Official Last Working Day
            </span>
            <span className="text-sm md:text-base font-black text-slate-900">
              {calculateLWD() || 'Select Date'}
            </span>
          </div>
        </div>
      </div>

      {/* ── 4-Phase Checklist Stream ───────────────────────────────── */}
      <div className="space-y-6">
        {phases.map((phase) => {
          const filteredItems = getFilteredItems(phase.items)
          const PhaseIcon = typeof phase.icon === 'function' ? phase.icon : (PHASE_ICONS[phase.id] || CheckCircle2)
          const phaseCompleted = phase.items.filter((i) => i.completed).length
          const isAdding = activeAddingPhase === phase.id

          return (
            <div
              key={phase.id}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
                    <PhaseIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-sm md:text-base font-bold text-slate-900">{phase.title}</h2>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {phaseCompleted} of {phase.items.length} tasks completed
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600">
                    {Math.round((phaseCompleted / (phase.items.length || 1)) * 100)}%
                  </span>
                  <button
                    onClick={() => setActiveAddingPhase(isAdding ? null : phase.id)}
                    className="px-2.5 py-1 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                </div>
              </div>

              {/* Inline Add Task Box */}
              {isAdding && (
                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center gap-2">
                  <input
                    type="text"
                    value={newTaskTexts[phase.id] || ''}
                    onChange={(e) =>
                      setNewTaskTexts((prev) => ({ ...prev, [phase.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addTask(phase.id)
                    }}
                    placeholder={`Add custom milestone to ${phase.title.split(':')[0]}...`}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={() => addTask(phase.id)}
                    className="px-3.5 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setActiveAddingPhase(null)}
                    className="px-2 py-1.5 text-slate-400 hover:text-slate-600 text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div className="space-y-2.5">
                {filteredItems.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No tasks in this category.</p>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleTask(phase.id, item.id)}
                      className={`p-3.5 rounded-2xl border flex items-center gap-3.5 cursor-pointer transition-all group ${
                        item.completed
                          ? 'bg-slate-50/70 border-slate-100 opacity-75'
                          : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 shadow-2xs'
                      }`}
                    >
                      <button
                        type="button"
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                          item.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                            : 'border-slate-300 bg-white hover:border-blue-500 text-transparent'
                        }`}
                        aria-label="Toggle task"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                      <span
                        className={`text-xs md:text-sm leading-relaxed flex-1 ${
                          item.completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-800 font-medium'
                        }`}
                      >
                        {item.task}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteTask(phase.id, item.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Resignation Email Modal ────────────────────────────────── */}
      <AnimatePresence>
        {showEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setShowEmailModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 z-10 text-slate-800 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Professional Resignation Email Generator</h3>
                    <p className="text-[11px] text-slate-500">Customized with your calculated Last Working Day</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-xl transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Input Customizers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Manager's Name</label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Your Role</label>
                  <input
                    type="text"
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Email preview area */}
              <div className="flex-1 overflow-y-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed shadow-inner">
                {emailTemplate}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
                <span className="text-[11px] text-slate-400">
                  Calculated Last Working Day: <strong className="text-slate-800">{calculateLWD()}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={downloadEmailTxt}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Download (.txt)</span>
                  </button>
                  <button
                    onClick={copyEmail}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    {emailCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{emailCopied ? 'Copied!' : 'Copy to Clipboard'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ResignationChecklist
