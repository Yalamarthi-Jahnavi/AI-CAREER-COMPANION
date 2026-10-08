import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, ArrowRight, Clock } from 'lucide-react'
import { Button } from '../ui/Button'
import { useLearningPlannerStore } from '../../store/useLearningPlannerStore'

export function RescheduleModal({ task, isOpen, onClose }) {
  const { rescheduleTask } = useLearningPlannerStore()
  const [customDate, setCustomDate] = useState('Tomorrow')

  const handleReschedule = (target) => {
    if (!task) return
    rescheduleTask(task.id, target)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && task && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 z-10 text-slate-800"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Reschedule Task</h3>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-xl transition-colors"
                aria-label="Close"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Rescheduling <strong className="text-slate-800 font-semibold">"{task.topic}"</strong>. Select when you would like to tackle this session:
            </p>

            <div className="space-y-2 mb-5">
              {['Tomorrow', 'This Weekend', 'Next Week', 'Push by 2 days'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleReschedule(option)}
                  className="w-full text-left px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 hover:border-blue-500 hover:bg-blue-50/60 text-xs font-semibold text-slate-700 hover:text-blue-700 transition-all flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
                    {option}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                placeholder="Or custom target (e.g. Next Saturday)..."
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => handleReschedule(customDate)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Set
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default RescheduleModal
