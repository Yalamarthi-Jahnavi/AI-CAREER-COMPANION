import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  Clock,
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Compass,
  BookOpen,
  Code,
  Check,
  X,
  ChevronRight,
  Flame,
  TrendingUp,
  Zap,
  CheckSquare,
  HelpCircle,
} from 'lucide-react'
import { useDeadlinePlannerStore } from '../store/useDeadlinePlannerStore'
import { usePracticeStore } from '../store/usePracticeStore'

export function DeadlinePlanner() {
  const navigate = useNavigate()
  const {
    technology,
    deadlineDays,
    dailyHours,
    currentLevel,
    targetDate,
    weeks,
    weeklySchedule,
    proposedChange,
    isProposalModalOpen,
    setGoal,
    acceptProposedChange,
    declineProposedChange,
    openProposalModal,
    closeProposalModal,
  } = useDeadlinePlannerStore()

  const { startTest } = usePracticeStore()

  // Local editing inputs
  const [inputTech, setInputTech] = useState(technology)
  const [inputDays, setInputDays] = useState(deadlineDays)
  const [inputHours, setInputHours] = useState(dailyHours)
  const [inputLevel, setInputLevel] = useState(currentLevel)
  const [isGoalEditorOpen, setIsGoalEditorOpen] = useState(false)

  // Start practice test directly from schedule
  const handleLaunchPractice = (scheduleItem) => {
    startTest({
      technology: scheduleItem.practiceTech || technology.toLowerCase(),
      difficulty: scheduleItem.practiceDifficulty || currentLevel,
      questionCount: scheduleItem.type === 'Mock Test' ? 10 : 5,
      durationMinutes: scheduleItem.type === 'Mock Test' ? 20 : 10,
    })
    navigate('/app/current-technology-practice')
  }

  // Handle goal submission
  const handleApplyGoal = (e) => {
    e.preventDefault()
    setGoal({
      technology: inputTech,
      deadlineDays: Number(inputDays),
      dailyHours: Number(inputHours),
      currentLevel: inputLevel,
    })
    setIsGoalEditorOpen(false)
  }

  const formattedTargetDate = new Date(targetDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-slate-800 font-sans">
      {/* ─── 1. Page Header ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Deadline &amp; Practice Planner
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 border border-blue-100 text-blue-700">
              Adaptive Milestone Engine
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500">
            Connects your target learning deadline, daily availability, and automated practice testing into an adaptive weekly schedule.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/app/learning-planner')}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Full Learning Planner</span>
          </button>

          <button
            onClick={() => setIsGoalEditorOpen(!isGoalEditorOpen)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Target className="w-3.5 h-3.5" />
            <span>{isGoalEditorOpen ? 'Close Goal Setup' : 'Set New Deadline'}</span>
          </button>
        </div>
      </div>

      {/* ─── 2. PROPOSED SCHEDULE ADAPTATION BANNER ─────────── */}
      <AnimatePresence>
        {proposedChange && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`p-6 rounded-3xl border shadow-sm relative overflow-hidden ${
              proposedChange.type === 'level_up'
                ? 'bg-gradient-to-r from-emerald-50/90 via-white to-teal-50/70 border-emerald-200'
                : 'bg-gradient-to-r from-amber-50/90 via-white to-orange-50/70 border-amber-200'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      proposedChange.type === 'level_up'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Proposed Schedule Adaptation (Requires Your Approval)
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900">
                  {proposedChange.title}
                </h3>

                <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-3xl">
                  {proposedChange.reason}
                </p>

                {/* Proposed vs Current summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Current Plan
                    </span>
                    <span className="text-slate-700 font-medium">
                      {proposedChange.currentPlanSummary}
                    </span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs border shadow-2xs ${
                      proposedChange.type === 'level_up'
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50/70 border-amber-200 text-amber-900'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold block mb-1">
                      Proposed Adaptive Adjustment
                    </span>
                    <span className="font-bold">
                      {proposedChange.proposedPlanSummary}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-2.5 flex-shrink-0">
                <button
                  onClick={acceptProposedChange}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs flex items-center justify-center gap-1.5 transition-all ${
                    proposedChange.type === 'level_up'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept &amp; Update Schedule</span>
                </button>

                <button
                  onClick={declineProposedChange}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Keep Current Schedule</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 3. Goal Setup Editor (Expandable) ──────────────────── */}
      <AnimatePresence>
        {isGoalEditorOpen && (
          <motion.form
            onSubmit={handleApplyGoal}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Configure Target Deadline &amp; Availability
              </h3>
              <span className="text-xs text-slate-400">
                Example: &ldquo;I need to learn React in 30 days at 1 hour/day&rdquo;
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Technology */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Target Technology
                </label>
                <select
                  value={inputTech}
                  onChange={(e) => setInputTech(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="React">React</option>
                  <option value="Python">Python</option>
                  <option value="SQL">SQL</option>
                  <option value="AWS">AWS</option>
                  <option value="Docker">Docker</option>
                  <option value="JavaScript">JavaScript</option>
                </select>
              </div>

              {/* Deadline */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Target Deadline (Days)
                </label>
                <select
                  value={inputDays}
                  onChange={(e) => setInputDays(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="30">30 Days (Sprint)</option>
                  <option value="60">60 Days (Standard)</option>
                  <option value="90">90 Days (Full Mastery)</option>
                </select>
              </div>

              {/* Availability */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Daily Availability
                </label>
                <select
                  value={inputHours}
                  onChange={(e) => setInputHours(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="0.5">30 Minutes / day</option>
                  <option value="1">1 Hour / day (Recommended)</option>
                  <option value="1.5">1.5 Hours / day</option>
                  <option value="2">2 Hours / day</option>
                </select>
              </div>

              {/* Current Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Starting Level
                </label>
                <select
                  value={inputLevel}
                  onChange={(e) => setInputLevel(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsGoalEditorOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Generate Milestone Schedule</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* ─── 4. Active Goal Summary Card (Dashboard style hero) ─── */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-sky-100/60 border border-blue-100 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
              Active Milestone Objective
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              &ldquo;I need to learn {technology} in {deadlineDays} days.&rdquo;
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              Availability: <strong className="text-slate-900">{dailyHours} hour/day</strong> • Track:{' '}
              <strong className="text-slate-900">{currentLevel}</strong> • Target Date:{' '}
              <strong className="text-blue-700">{formattedTargetDate}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="p-4 rounded-2xl bg-white border border-blue-100 text-center min-w-[105px] shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Total Budget
              </span>
              <span className="text-2xl font-black text-slate-900">
                {Math.round(deadlineDays * dailyHours)}h
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-blue-100 text-center min-w-[105px] shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Milestones
              </span>
              <span className="text-2xl font-black text-blue-600">
                {weeks.length} Wks
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-blue-100 text-center min-w-[105px] shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Tests / Wk
              </span>
              <span className="text-2xl font-black text-emerald-600">
                3 Tests
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 5. The 4-Week Milestone Breakdown ─────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
              Curriculum Milestone Phases
            </h2>
            <p className="text-xs text-slate-500">
              4-week structured progression derived from your {deadlineDays}-day deadline
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 border border-blue-100 text-blue-700">
            4 Core Phases
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {weeks.map((wk, idx) => (
            <div
              key={wk.weekNumber}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all space-y-3 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-50 border border-blue-100 text-blue-700">
                    Week {wk.weekNumber}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    Days {(idx * 7) + 1}–{(idx + 1) * 7}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">
                  {wk.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {wk.description}
                </p>
              </div>

              <div className="space-y-1 pt-3 border-t border-slate-100">
                {wk.topics?.map((topic, i) => (
                  <div key={i} className="text-[11px] text-slate-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="truncate">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 6. Automatically Scheduled Weekly Timetable ───────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Automated Weekly Schedule &amp; Practice Tests
            </h2>
            <p className="text-xs text-slate-500">
              Balanced rhythm: Learn → Practice → Learn → Practice → Revision → Mock Test → Review
            </p>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Learn Days
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Practice Tests
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Mock Tests
            </span>
          </div>
        </div>

        {/* 7-Day Timetable Grid (Monday to Sunday) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {weeklySchedule.map((item) => {
            const isPractice = item.type === 'Practice' || item.type === 'Mock Test'
            const isCompleted = item.status === 'completed'

            let headerColor = 'bg-blue-50 text-blue-700 border-blue-200'
            if (item.type === 'Practice') {
              headerColor = 'bg-emerald-50 text-emerald-700 border-emerald-200'
            } else if (item.type === 'Mock Test') {
              headerColor = 'bg-purple-50 text-purple-700 border-purple-200'
            } else if (item.type === 'Revision') {
              headerColor = 'bg-amber-50 text-amber-700 border-amber-200'
            }

            return (
              <div
                key={item.day}
                className={`p-4 rounded-3xl border flex flex-col justify-between transition-all space-y-3 ${
                  isCompleted
                    ? 'bg-slate-50/70 border-slate-200 opacity-80'
                    : isPractice
                    ? 'bg-white border-emerald-200 shadow-xs hover:border-emerald-400'
                    : 'bg-white border-slate-200/90 shadow-xs hover:border-blue-400'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">{item.day}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${headerColor}`}>
                      {item.type}
                    </span>
                  </div>

                  <div className="text-[11px] font-bold text-slate-800 leading-tight">
                    {item.title}
                  </div>

                  <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-3">
                    {item.task}
                  </p>
                </div>

                <div className="space-y-2 pt-2.5 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-slate-600">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.duration}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">
                      {item.tag}
                    </span>
                  </div>

                  {/* Practice / Mock Test CTA */}
                  {isPractice && (
                    <button
                      type="button"
                      className={`w-full text-[11px] py-1.5 px-2 rounded-xl font-bold transition-all ${
                        item.type === 'Mock Test'
                          ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                      onClick={() => handleLaunchPractice(item)}
                    >
                      {item.type === 'Mock Test' ? 'Start Mock Test' : 'Start Practice'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── 7. Connection Architecture Explainer ──────────────── */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start gap-4 text-slate-700">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
          <HelpCircle className="w-5 h-5" />
        </div>

        <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-900 block text-sm font-bold">
            How the Adaptive Learning &amp; Practice Connection Works
          </strong>
          <p>
            1. <strong>Goal Definition:</strong> The Deadline Planner sets milestone dates and allocates your daily hours across the 4-week curriculum.
          </p>
          <p>
            2. <strong>Automated Practice Scheduling:</strong> Practice tests are scheduled seamlessly, connected directly to the Current Technology Practice system.
          </p>
          <p>
            3. <strong>Performance-Adaptive Feedback:</strong> When you complete a test, poor performance recommends targeted weak topic drills, while strong performance (&ge; 85%) recommends leveling up.
          </p>
          <p className="text-blue-700 font-semibold">
            4. <strong>User Protection:</strong> The system will never automatically change your schedule without presenting a detailed proposal with before-and-after comparisons for your explicit approval.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DeadlinePlanner
