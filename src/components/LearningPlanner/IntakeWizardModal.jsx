import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Sparkles,
  Clock,
  Briefcase,
  Target,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import {
  KNOWLEDGE_LEVELS,
  TIME_SLOTS,
} from '../../api/learningPlannerApi'
import { useLearningPlannerStore } from '../../store/useLearningPlannerStore'

const POPULAR_TECHS = ['React', 'Python', 'Docker', 'SQL', 'AWS', 'Generative AI', 'TypeScript', 'Kubernetes']
const POPULAR_CAREERS = [
  'AI Engineer',
  'Senior Full Stack Engineer',
  'Cloud DevOps Architect',
  'Backend Microservices Developer',
  'Machine Learning Specialist',
  'Data Platform Engineer',
]

export function IntakeWizardModal({ isOpen, onClose, initialTech }) {
  const { updateRoadmapConfig } = useLearningPlannerStore()

  const [tech, setTech] = useState(initialTech || 'React')
  const [level, setLevel] = useState('Intermediate')
  const [selectedSlots, setSelectedSlots] = useState(['evening'])
  const [dailyHours, setDailyHours] = useState(1.5)
  const [targetCareer, setTargetCareer] = useState('AI Engineer')
  const [durationDays, setDurationDays] = useState(90)

  const toggleSlot = (slotId) => {
    if (selectedSlots.includes(slotId)) {
      if (selectedSlots.length > 1) {
        setSelectedSlots(selectedSlots.filter((s) => s !== slotId))
      }
    } else {
      setSelectedSlots([...selectedSlots, slotId])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateRoadmapConfig({
      technology: tech,
      level,
      freeTimeSlots: selectedSlots,
      dailyHours: Number(dailyHours),
      targetCareer,
      durationDays: Number(durationDays),
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col text-slate-800"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    Personalize Technology Learning Roadmap
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tailor curriculum, duration, and daily timetable to your real availability
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
              {/* 1. Target Technology */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  1. Target Technology
                </label>
                <div className="flex flex-wrap gap-2 mb-2.5">
                  {POPULAR_TECHS.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setTech(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        tech.toLowerCase() === t.toLowerCase()
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => setTech(e.target.value)}
                  placeholder="Or type custom technology (e.g. Next.js, PyTorch, Go)..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* 2. Current Knowledge Level */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  2. Current Knowledge Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {KNOWLEDGE_LEVELS.map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setLevel(lvl)}
                      className={`p-3 rounded-2xl border text-center font-semibold text-xs transition-all ${
                        level === lvl
                          ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500/40 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Available Learning Time */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    3. When are you free to learn?
                  </label>
                  <span className="text-[11px] text-blue-600 font-semibold">Select multiple slots</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedSlots.includes(slot.id)
                    return (
                      <button
                        type="button"
                        key={slot.id}
                        onClick={() => toggleSlot(slot.id)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-blue-50/90 border-blue-500 text-blue-900 ring-1 ring-blue-500/30 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">{slot.icon} {slot.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate">{slot.timeRange}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Daily hours slider */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Daily Time Budget:
                    </span>
                    <span className="font-bold text-blue-700 px-2.5 py-0.5 rounded-full bg-blue-100/80 border border-blue-200">
                      {dailyHours} {dailyHours === 1 ? 'Hour' : 'Hours'} / Day
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="4"
                    step="0.5"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>30 min (Light)</span>
                    <span>1.5 hrs (Recommended)</span>
                    <span>3+ hrs (Intensive)</span>
                  </div>
                  <p className="text-[11px] text-emerald-600 font-medium pt-1">
                    ✓ Schedule strictly respects this budget. Never generates unrealistic 4-hour days if you choose {dailyHours}h.
                  </p>
                </div>
              </div>

              {/* 4. Target Career */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  4. Target Career Role
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {POPULAR_CAREERS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setTargetCareer(c)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-colors ${
                        targetCareer === c
                          ? 'bg-blue-100 border-blue-400 text-blue-800 font-semibold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={targetCareer}
                  onChange={(e) => setTargetCareer(e.target.value)}
                  placeholder="Target career role..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* 5. Deadline / Duration Plan */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  5. Roadmap Duration
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { days: 30, title: '30-Day Sprint', desc: 'Fast-track essentials' },
                    { days: 60, title: '60-Day Plan', desc: 'Balanced mastery' },
                    { days: 90, title: '90-Day Full', desc: 'Complete job readiness' },
                  ].map((plan) => (
                    <button
                      type="button"
                      key={plan.days}
                      onClick={() => setDurationDays(plan.days)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        durationDays === plan.days
                          ? 'bg-blue-50/90 border-blue-500 text-blue-900 ring-1 ring-blue-500/30 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-bold text-xs md:text-sm block text-slate-900">{plan.title}</span>
                      <span className="text-[10px] text-slate-500">{plan.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 7-Stage Pipeline Preview Tag */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs">
                <span className="font-bold text-slate-900 block mb-1">
                  Structured 7-Stage Curriculum Pipeline:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-blue-700 font-mono font-semibold">
                  <span>FOUNDATION</span> → <span>CORE</span> → <span>INTERMEDIATE</span> →{' '}
                  <span>ADVANCED</span> → <span>PROJECTS</span> → <span>PRACTICE</span> →{' '}
                  <span>INTERVIEW</span>
                </div>
              </div>

              {/* Submit Actions */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate My Roadmap</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default IntakeWizardModal
