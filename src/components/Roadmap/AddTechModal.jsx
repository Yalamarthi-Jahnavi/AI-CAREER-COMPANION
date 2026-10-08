import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Plus, CheckCircle2, Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { useRoadmapStore } from '../../store/useRoadmapStore'

export function AddTechModal({ isOpen, onClose }) {
  const { technologies, myCurrentTechnologies, addCurrentTech } = useRoadmapStore()
  const [filterCategory, setFilterCategory] = useState('All')
  const [search, setSearch] = useState('')

  if (!isOpen) return null

  const categories = ['All', ...new Set(technologies.map((t) => t.category))]

  const filtered = technologies.filter((t) => {
    const matchesCategory = filterCategory === 'All' || t.category === filterCategory
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <AnimatePresence>
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
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl max-h-[85vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col font-sans text-slate-800"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Add to My Current Technologies</h3>
                <p className="text-xs text-slate-500">Choose a technology to add to your hands-on practice stack</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filter bar */}
          <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search technologies by name or domain..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                    filterCategory === cat
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Technology List */}
          <div className="p-4 overflow-y-auto flex-1 space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No technologies found matching your search.
              </div>
            ) : (
              filtered.map((tech) => {
                const isAlreadyInStack = myCurrentTechnologies.some(
                  (t) => t.id === tech.id || t.name.toLowerCase() === tech.name.toLowerCase()
                )

                return (
                  <div
                    key={tech.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-3 hover:border-blue-300 hover:bg-blue-50/20 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-xs border border-slate-200/60"
                        style={{ backgroundColor: `${tech.color}15`, color: tech.color }}
                      >
                        {tech.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{tech.name}</h4>
                          <span className="text-[11px] text-slate-400 font-medium">
                            ({tech.category})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{tech.estimatedLearningTime} • {tech.level}</p>
                      </div>
                    </div>

                    <div>
                      {isAlreadyInStack ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Added
                        </span>
                      ) : (
                        <button
                          onClick={() => addCurrentTech(tech)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Stack</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
