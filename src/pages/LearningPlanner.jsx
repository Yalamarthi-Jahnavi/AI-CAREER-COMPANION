import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  SkipForward,
  Edit3,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Flame,
  Filter,
  RefreshCw,
  Search,
  Award,
  Layers,
  ChevronRight,
  AlertCircle,
  CalendarClock,
  Check,
  X,
  Zap,
  Target,
  AlertTriangle,
} from 'lucide-react'
import { useLearningPlannerStore } from '../store/useLearningPlannerStore'
import { useDeadlinePlannerStore } from '../store/useDeadlinePlannerStore'
import { usePracticeStore } from '../store/usePracticeStore'
import { Skeleton } from '../components/ui/Skeleton'
import { IntakeWizardModal } from '../components/LearningPlanner/IntakeWizardModal'
import { EditTaskModal } from '../components/LearningPlanner/EditTaskModal'
import { RescheduleModal } from '../components/LearningPlanner/RescheduleModal'
import { AddTaskModal } from '../components/LearningPlanner/AddTaskModal'

export function LearningPlanner() {
  const location = useLocation()
  const navigate = useNavigate()

  const {
    roadmap,
    activeTabDuration,
    selectedFilter,
    searchQuery,
    isLoading,
    loadRoadmap,
    switchDuration,
    completeTask,
    skipTask,
    setFilter,
    setSearchQuery,
    isIntakeModalOpen,
    openIntakeModal,
    closeIntakeModal,
    editingTask,
    openEditModal,
    closeEditModal,
    reschedulingTask,
    openRescheduleModal,
    closeRescheduleModal,
    addingTaskToWeek,
    openAddTaskModal,
    closeAddTaskModal,
  } = useLearningPlannerStore()

  const {
    technology: deadlineTech,
    deadlineDays,
    dailyHours: deadlineDailyHours,
    currentLevel: deadlineLevel,
    weeks: deadlineWeeks,
    weeklySchedule,
    proposedChange,
    acceptProposedChange,
    declineProposedChange,
  } = useDeadlinePlannerStore()

  const { startTest } = usePracticeStore()

  const handleLaunchPractice = (scheduleItem) => {
    startTest({
      technology: scheduleItem.practiceTech || (deadlineTech ? deadlineTech.toLowerCase() : 'react'),
      difficulty: scheduleItem.practiceDifficulty || deadlineLevel,
      questionCount: scheduleItem.type === 'Mock Test' ? 10 : 5,
      durationMinutes: scheduleItem.type === 'Mock Test' ? 20 : 10,
    })
    navigate('/app/current-technology-practice')
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const techQuery = params.get('tech')
    if (techQuery) {
      loadRoadmap({ technology: techQuery })
    } else {
      loadRoadmap()
    }
  }, [location.search, loadRoadmap])

  const stagesList = roadmap?.stages || []

  // Filter days based on tab filter & search
  const filteredDays = (roadmap?.days || []).filter((day) => {
    if (selectedFilter === 'Completed' && !day.completed) return false
    if (selectedFilter === 'Skipped' && !day.skipped) return false
    if (selectedFilter === 'Upcoming' && (day.completed || day.skipped)) return false
    if (selectedFilter === 'Today' && day.dayNumber !== 8) return false

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchTopic = day.topic.toLowerCase().includes(q)
      const matchStage = day.stage.toLowerCase().includes(q)
      const matchMini = day.miniTask?.toLowerCase().includes(q)
      const matchProj = day.projectTask?.toLowerCase().includes(q)
      return matchTopic || matchStage || matchMini || matchProj
    }
    return true
  })

  if (isLoading && !roadmap) {
    return (
      <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
        <div className="space-y-3">
          <Skeleton className="w-80 h-8" />
          <Skeleton className="w-96 h-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-800 font-sans">
      {/* ─── Hero Header Banner (Dashboard Style) ──────────────── */}
      <div className="rounded-3xl p-6 md:p-8 relative overflow-hidden bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-blue-50/60 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4.5 h-4.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
              Personalized Learning Blueprint
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white border border-emerald-200 text-emerald-700 shadow-2xs">
              {roadmap?.technology} • {roadmap?.level}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Personalized Learning Roadmap
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-2 leading-relaxed">
            Strictly tailored to your available time budget ({roadmap?.slotLabel} • {roadmap?.dailyHours}h/day) targeting <strong className="text-slate-900">{roadmap?.targetCareer}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap relative z-10">
          <button
            onClick={() => navigate('/app/deadline-planner')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <CalendarClock className="w-4 h-4 text-blue-600" />
            <span>Deadline Planner</span>
          </button>
          <button
            onClick={() => openIntakeModal()}
            className="px-4 py-2.5 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Customize Plan</span>
          </button>
          <button
            onClick={() => navigate('/app/current-technology-practice')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Flame className="w-4 h-4" />
            <span>Practice Today</span>
          </button>
        </div>
      </div>

      {/* ─── PROPOSED SCHEDULE ADAPTATION BANNER ──────────────── */}
      <AnimatePresence>
        {proposedChange && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={`p-6 rounded-3xl border shadow-xs relative overflow-hidden ${
              proposedChange.type === 'level_up'
                ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-emerald-200'
                : 'bg-gradient-to-r from-amber-50 via-orange-50 to-white border-amber-200'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 ${
                    proposedChange.type === 'level_up'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Proposed Schedule Adaptation (Requires Your Approval)
                </span>

                <h3 className="text-xl font-bold text-slate-900">
                  {proposedChange.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                  {proposedChange.reason}
                </p>

                {/* Comparison box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Current Plan
                    </span>
                    <span className="text-slate-700 font-medium">
                      {proposedChange.currentPlanSummary}
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl text-xs border shadow-2xs ${
                      proposedChange.type === 'level_up'
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-900'
                        : 'bg-amber-100/60 border-amber-300 text-amber-900'
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

              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-2.5 flex-shrink-0">
                <button
                  onClick={acceptProposedChange}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept & Update Schedule</span>
                </button>

                <button
                  onClick={declineProposedChange}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Keep Current Schedule</span>
                </button>

                <button
                  onClick={() => navigate('/app/deadline-planner')}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-medium flex items-center justify-center gap-1"
                >
                  <CalendarClock className="w-3.5 h-3.5" />
                  <span>Open in Deadline Planner</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Connected Deadline & Practice Testing Section ────────── */}
      <section className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 space-y-6 shadow-xs relative overflow-hidden">
        {/* Header & Goal Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 border border-blue-200 text-blue-700 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" />
                Adaptive Milestone Engine
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                {deadlineLevel}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>&ldquo;I need to learn {deadlineTech} in {deadlineDays} days.&rdquo;</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Target availability: <strong className="text-slate-800">{deadlineDailyHours} hour/day</strong> • Synchronized with automated practice drills & 4-week milestones.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/app/deadline-planner')}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <CalendarClock className="w-4 h-4 text-blue-600" />
              <span>Adjust Deadline</span>
            </button>
            <button
              onClick={() => {
                startTest({
                  technology: deadlineTech ? deadlineTech.toLowerCase() : 'react',
                  difficulty: deadlineLevel,
                  questionCount: 5,
                  durationMinutes: 10,
                })
                navigate('/app/current-technology-practice')
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Flame className="w-4 h-4" />
              <span>Launch Practice Test</span>
            </button>
          </div>
        </div>

        {/* 4-Week Milestone Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-600" />
              4-Week Milestone Roadmap ({deadlineTech})
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {deadlineWeeks?.length || 4} Phases • 30-Day Trajectory
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {deadlineWeeks?.map((wk, idx) => (
              <div
                key={wk.weekNumber}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-white transition-all space-y-2.5 flex flex-col justify-between shadow-2xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
                      Week {wk.weekNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Days {(idx * 7) + 1}–{(idx + 1) * 7}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {wk.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {wk.description}
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-200">
                  {wk.topics?.map((topic, i) => (
                    <div key={i} className="text-[10px] text-slate-700 flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                      <span className="truncate">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Timetable with Practice Test Launchers */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Weekly Cadence & Automated Practice Testing
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              Regular test checkpoints calibrate your difficulty level
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {weeklySchedule?.map((item) => {
              const isPractice = item.type === 'Practice' || item.type === 'Mock Test'
              let badgeColor = 'bg-blue-50 text-blue-700 border-blue-200'
              if (item.type === 'Practice') {
                badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200'
              } else if (item.type === 'Mock Test') {
                badgeColor = 'bg-purple-50 text-purple-700 border-purple-200'
              } else if (item.type === 'Revision') {
                badgeColor = 'bg-amber-50 text-amber-700 border-amber-200'
              }

              return (
                <div
                  key={item.day}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all space-y-2.5 ${
                    isPractice
                      ? 'bg-blue-50/40 border-blue-200 shadow-2xs'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{item.day}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${badgeColor}`}>
                        {item.type}
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 leading-tight">
                      {item.title}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                      {item.task}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1.5 border-t border-slate-200">
                    <div className="flex items-center justify-between text-[9px] text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-slate-600">
                        <Clock className="w-2.5 h-2.5" />
                        {item.duration}
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase">
                        {item.tag}
                      </span>
                    </div>

                    {isPractice && (
                      <button
                        className="w-full text-[10px] font-bold py-1 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-2xs"
                        onClick={() => handleLaunchPractice(item)}
                      >
                        {item.type === 'Mock Test' ? 'Mock Test' : 'Practice'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Overall Learning Progress & Metrics ─────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Curriculum Progress
          </span>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-black text-slate-900">{roadmap?.progressPercentage}%</span>
            <span className="text-xs text-slate-500">completed</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
              style={{ width: `${roadmap?.progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Hours Invested
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{roadmap?.completedHours}h</span>
            <span className="text-xs text-slate-400 font-semibold">/ {roadmap?.totalPlannedHours}h total</span>
          </div>
          <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold pt-1">
            <Clock className="w-3.5 h-3.5" /> Budget: {roadmap?.dailyHours} hr/day
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Milestones Finished
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{roadmap?.completedTasks}</span>
            <span className="text-xs text-slate-400 font-semibold">/ {roadmap?.totalTasks} tasks</span>
          </div>
          <span className="text-[11px] text-blue-600 flex items-center gap-1 font-semibold pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 7 Completed this week
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Target Career Role
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-blue-700 truncate">{roadmap?.targetCareer}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium block pt-1">
            {roadmap?.durationDays}-Day Adaptive Program
          </span>
        </div>
      </div>

      {/* ─── 7-Stage Structured Pipeline Visual Indicator ─────── */}
      <section className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            7-Stage Architectural Learning Pipeline
          </h3>
          <span className="text-xs text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Active: {roadmap?.currentStageId?.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {stagesList.map((stg, index) => {
            const isCurrent = roadmap?.currentStageId === stg.id
            const isCompleted = index < 2

            return (
              <div key={stg.id} className="flex items-center shrink-0">
                <div
                  className={`px-3.5 py-2.5 rounded-2xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-blue-50 border-blue-500 shadow-xs ring-1 ring-blue-500/30 text-blue-900'
                      : isCompleted
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5 justify-center">
                    <span className="text-[10px] font-black opacity-60">0{index + 1}</span>
                    <span className="text-xs font-bold uppercase tracking-wider">{stg.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 hidden sm:block max-w-[120px] truncate">
                    {stg.description}
                  </span>
                </div>

                {index < stagesList.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-slate-300 mx-1 shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ─── Roadmap Duration Tabs (30-Day, 60-Day, 90-Day) ───── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs self-start">
          {[30, 60, 90].map((days) => (
            <button
              key={days}
              onClick={() => switchDuration(days)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTabDuration === days
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {days}-Day Roadmap
            </button>
          ))}
        </div>

        {/* Search & Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics or tasks..."
              className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-2xl shadow-2xs">
            {['All', 'Today', 'Upcoming', 'Completed', 'Skipped'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  selectedFilter === f
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Schedule & Timetable List ────────────────────────── */}
      <div className="space-y-6">
        {roadmap?.weeks?.map((week) => {
          const weekDays = week.days.filter((d) => filteredDays.some((fd) => fd.id === d.id))
          if (weekDays.length === 0) return null

          return (
            <div
              key={week.weekNumber}
              className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs"
            >
              {/* Week Header */}
              <div className="p-4 md:px-6 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 font-black text-sm flex items-center justify-center shadow-2xs">
                    W{week.weekNumber}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">
                        Week {week.weekNumber}: {week.primaryTopic}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white border border-slate-200 text-slate-700 uppercase">
                        {week.stage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{week.stageDescription}</p>
                  </div>
                </div>

                <button
                  onClick={() => openAddTaskModal(week.weekNumber)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Add Task to Week {week.weekNumber}</span>
                </button>
              </div>

              {/* Days List */}
              <div className="divide-y divide-slate-100">
                {weekDays.map((day) => {
                  const isCompleted = day.completed
                  const isSkipped = day.skipped

                  return (
                    <motion.div
                      key={day.id}
                      layout
                      className={`p-4 md:p-5 transition-colors ${
                        isCompleted
                          ? 'bg-slate-50/60 opacity-80'
                          : isSkipped
                          ? 'bg-slate-50/30 opacity-60'
                          : 'hover:bg-blue-50/20'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Day Info & Status Toggle */}
                        <div className="flex items-start gap-3.5 flex-1">
                          <button
                            type="button"
                            onClick={() => completeTask(day.id)}
                            title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                            className={`mt-1 w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                              isCompleted
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                                : 'border-slate-300 bg-white hover:border-blue-500 text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>

                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-blue-700 font-mono">
                                {day.date}
                              </span>
                              <span className="text-slate-300">•</span>
                              <h4 className={`text-sm font-bold ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                {day.topic}
                              </h4>

                              {day.rescheduledDate && (
                                <span className="text-[10px] font-semibold text-amber-800 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 flex items-center gap-1">
                                  <CalendarClock className="w-3 h-3" />
                                  Rescheduled: {day.rescheduledDate}
                                </span>
                              )}

                              {isSkipped && (
                                <span className="text-[10px] font-semibold text-slate-500 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                                  Skipped
                                </span>
                              )}

                              {day.test && (
                                <span className="text-[10px] font-bold text-rose-700 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200">
                                  Assessment Quiz
                                </span>
                              )}
                            </div>

                            {/* Detailed schedule breakdown */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-xs pt-1">
                              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                                <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                                  Learning ({day.learningDuration})
                                </span>
                                <span className="text-slate-800 font-medium line-clamp-1">{day.topic}</span>
                              </div>

                              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                                <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                                  Practice ({day.practiceDuration})
                                </span>
                                <span className="text-blue-700 font-medium line-clamp-1">{day.practice}</span>
                              </div>

                              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                                <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                                  Mini Task
                                </span>
                                <span className="text-slate-700 line-clamp-1">{day.miniTask}</span>
                              </div>

                              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                                <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                                  Project Task
                                </span>
                                <span className="text-indigo-700 font-medium line-clamp-1">{day.projectTask}</span>
                              </div>
                            </div>

                            {/* Revision note */}
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                              <span className="text-amber-600 font-bold">Revision:</span>
                              <span>{day.revision}</span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Task Actions */}
                        <div className="flex items-center gap-2 self-end lg:self-center shrink-0 pt-2 lg:pt-0">
                          <button
                            onClick={() => completeTask(day.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs ${
                              isCompleted
                                ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isCompleted ? 'Done' : 'Complete'}</span>
                          </button>

                          <button
                            onClick={() => skipTask(day.id)}
                            title="Skip this task"
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <SkipForward className="w-3.5 h-3.5 text-slate-400" />
                            <span>{isSkipped ? 'Unskip' : 'Skip'}</span>
                          </button>

                          <button
                            onClick={() => openRescheduleModal(day)}
                            title="Reschedule"
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <CalendarClock className="w-3.5 h-3.5 text-blue-600" />
                            <span>Reschedule</span>
                          </button>

                          <button
                            onClick={() => openEditModal(day)}
                            title="Edit task"
                            className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* ─── Modals ─────────────────────────────────────────────── */}
      <IntakeWizardModal
        isOpen={isIntakeModalOpen}
        onClose={closeIntakeModal}
        initialTech={roadmap?.technology}
      />

      <EditTaskModal
        task={editingTask}
        isOpen={Boolean(editingTask)}
        onClose={closeEditModal}
      />

      <RescheduleModal
        task={reschedulingTask}
        isOpen={Boolean(reschedulingTask)}
        onClose={closeRescheduleModal}
      />

      <AddTaskModal
        weekNumber={addingTaskToWeek}
        isOpen={Boolean(addingTaskToWeek)}
        onClose={closeAddTaskModal}
      />
    </div>
  )
}

export default LearningPlanner
