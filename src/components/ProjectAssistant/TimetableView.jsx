import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  CheckSquare,
  Square,
  TrendingUp,
  Flag,
  Zap,
} from 'lucide-react'

export function TimetableView({ overview, timetable }) {
  const [completedTasks, setCompletedTasks] = useState({})

  const toggleTask = (weekNumber, taskIdx) => {
    const key = `${weekNumber}-${taskIdx}`
    setCompletedTasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Calculate overall progress
  const totalTasks = timetable.reduce((acc, w) => acc + w.tasks.length, 0)
  const doneCount = Object.values(completedTasks).filter(Boolean).length
  const progressPercent = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0

  return (
    <div className="space-y-7 font-sans text-slate-800">
      {/* Timetable Header Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Target Deadline</span>
            <Calendar className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3">
            <p className="text-xl font-black text-slate-900 tracking-tight">{overview.deadlineDate}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">{overview.totalDays} Days Remaining</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Weekly Capacity</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <p className="text-xl font-black text-slate-900 tracking-tight">{overview.availableHoursPerDay * 7} Hrs / Wk</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">{overview.availableHoursPerDay} hrs/day ({overview.teamType})</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Timeline</span>
            <Flag className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3">
            <p className="text-xl font-black text-slate-900 tracking-tight">{overview.totalWeeks} Weeks Blueprint</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">~{overview.totalHours} Total Effort Hours</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Schedule Completion</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold text-slate-900">
              <span>{doneCount} / {totalTasks} Tasks</span>
              <span className="text-blue-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timetable Phase Legend */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Zap className="w-4 h-4 text-amber-500" />
          Realistic Milestones & Pacing Strategy:
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Architecture
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Backend Core
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Frontend UI
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> AI & Deploy
          </span>
        </div>
      </div>

      {/* Week Breakdown List */}
      <div className="space-y-4">
        {timetable.map((week, idx) => (
          <motion.div
            key={week.weekNumber}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-blue-300 transition-all shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-black text-xs">
                  W{week.weekNumber}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{week.title}</h4>
                  <p className="text-xs text-blue-600 font-semibold">{week.phase}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  ~{week.estimatedHours} Hours Capacity
                </span>
              </div>
            </div>

            {/* Tasks list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {week.tasks.map((task, tIdx) => {
                const isChecked = !!completedTasks[`${week.weekNumber}-${tIdx}`]
                return (
                  <div
                    key={tIdx}
                    onClick={() => toggleTask(week.weekNumber, tIdx)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-800 line-through font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/30'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed font-medium">{task}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
