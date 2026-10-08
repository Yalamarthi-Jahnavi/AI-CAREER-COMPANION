import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Edit3, Save } from 'lucide-react'
import { Button } from '../ui/Button'
import { useLearningPlannerStore } from '../../store/useLearningPlannerStore'

export function EditTaskModal({ task, isOpen, onClose }) {
  const { editTask } = useLearningPlannerStore()

  const [topic, setTopic] = useState('')
  const [learningDuration, setLearningDuration] = useState('')
  const [practice, setPractice] = useState('')
  const [miniTask, setMiniTask] = useState('')
  const [projectTask, setProjectTask] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (task) {
      setTopic(task.topic || '')
      setLearningDuration(task.learningDuration || '')
      setPractice(task.practice || '')
      setMiniTask(task.miniTask || '')
      setProjectTask(task.projectTask || '')
      setNotes(task.notes || '')
    }
  }, [task])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!task) return
    editTask(task.id, {
      topic,
      learningDuration,
      practice,
      miniTask,
      projectTask,
      notes,
    })
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
            className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 text-slate-800"
          >
            <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Edit3 className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Edit Roadmap Task ({task.date})</h3>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-xl transition-colors"
                aria-label="Close"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Topic Title</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Learning Duration</label>
                  <input
                    type="text"
                    value={learningDuration}
                    onChange={(e) => setLearningDuration(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Practice Exercise</label>
                  <input
                    type="text"
                    value={practice}
                    onChange={(e) => setPractice(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Mini Task</label>
                <input
                  type="text"
                  value={miniTask}
                  onChange={(e) => setMiniTask(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Portfolio Project Milestone</label>
                <input
                  type="text"
                  value={projectTask}
                  onChange={(e) => setProjectTask(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Personal Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Key takeaways, links or reminders..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default EditTaskModal
