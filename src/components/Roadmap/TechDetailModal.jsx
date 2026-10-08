import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  TrendingUp,
  Clock,
  Briefcase,
  CheckCircle2,
  FolderGit2,
  MessageSquareQuote,
  Plus,
  Play,
  Layers,
  BookOpen,
  Check,
  Circle,
  Compass,
} from 'lucide-react'
import { useRoadmapStore } from '../../store/useRoadmapStore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export function TechDetailModal({ tech, isOpen, onClose }) {
  const navigate = useNavigate()
  const { myCurrentTechnologies, addCurrentTech, openPracticeModal } = useRoadmapStore()
  const [activeTab, setActiveTab] = useState('roadmap') // 'roadmap' | 'overview' | 'projects' | 'interview'

  // Interactive milestone state per stage
  const [completedStages, setCompletedStages] = useState(() => {
    try {
      const saved = localStorage.getItem(`tech_milestones_${tech?.id}`)
      return saved ? JSON.parse(saved) : [0]
    } catch {
      return [0]
    }
  })

  if (!isOpen || !tech) return null

  const isAlreadyInStack = myCurrentTechnologies.some(
    (t) => t.id === tech.id || t.name.toLowerCase() === tech.name.toLowerCase()
  )

  const handleAddToStack = () => {
    addCurrentTech(tech)
  }

  const handleStartPractice = (customDifficulty) => {
    onClose()
    openPracticeModal({ id: tech.id, name: tech.name, difficulty: customDifficulty || tech.level })
  }

  const toggleStage = (idx) => {
    setCompletedStages((prev) => {
      const next = prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
      try {
        localStorage.setItem(`tech_milestones_${tech.id}`, JSON.stringify(next))
      } catch {}
      if (!prev.includes(idx)) {
        toast.success(`Milestone stage ${idx + 1} marked as complete! 🎉`)
      }
      return next
    })
  }

  // Dynamic 4-stage sequential roadmap milestones
  const stages = [
    {
      title: 'Stage 1: Core Fundamentals & Syntax',
      duration: 'Weeks 1–2',
      difficulty: 'Beginner',
      topics: tech.skillsRequired?.slice(0, 2) || ['Core Syntax', 'Environment Setup'],
      goal: `Master foundational semantics, runtime model, and data patterns for ${tech.name}.`,
    },
    {
      title: 'Stage 2: Essential APIs & Architecture',
      duration: 'Weeks 3–4',
      difficulty: 'Intermediate',
      topics: tech.skillsRequired?.slice(2, 4) || ['Design Patterns', 'API Integration'],
      goal: `Build production-grade modules, implement error handling, and integrate common libraries.`,
    },
    {
      title: 'Stage 3: Advanced Patterns & State Orchestration',
      duration: 'Weeks 5–6',
      difficulty: 'Advanced',
      topics: tech.interviewTopics?.slice(0, 2) || ['Performance Profiling', 'Memory Management'],
      goal: `Deep dive into internal execution engines, concurrent flows, and optimization best practices.`,
    },
    {
      title: 'Stage 4: Production Scale, Testing & CI/CD',
      duration: 'Weeks 7–8',
      difficulty: 'Mastery',
      topics: tech.projectSuggestions?.map((p) => p.title) || ['Microservice Architecture', 'Automated QA'],
      goal: `Architect end-to-end applications, write integration test suites, and deploy with observability.`,
    },
  ]

  const roadmapProgress = Math.round((completedStages.length / stages.length) * 100)

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
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col font-sans text-slate-800"
        >
          {/* Header Banner */}
          <div
            className="p-6 border-b border-slate-100 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${tech.color}15 0%, rgba(248, 250, 252, 0.95) 100%)`,
            }}
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border shadow-xs"
                  style={{
                    backgroundColor: `${tech.color}20`,
                    borderColor: `${tech.color}40`,
                    color: tech.color,
                  }}
                >
                  {tech.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                      {tech.name}
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 border border-blue-200 text-blue-700">
                      {tech.category}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 border border-slate-200 text-slate-700">
                      {tech.level} Tier
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {tech.relevance?.status} ({tech.relevance?.growth})
                    </span>
                    <span>•</span>
                    <span className="text-slate-600">{tech.relevance?.openings}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors shadow-2xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 mt-5 border-t border-slate-200/60 pt-3 overflow-x-auto scrollbar-thin">
              {[
                { id: 'roadmap', label: 'Interactive Learning Roadmap', icon: Compass },
                { id: 'overview', label: 'Requirements & Relevance', icon: BookOpen },
                { id: 'projects', label: 'Portfolio Projects', icon: FolderGit2 },
                { id: 'interview', label: 'Interview Topics', icon: MessageSquareQuote },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Relevance Score
                </span>
                <span className="text-lg font-black text-slate-900">{tech.relevance?.score}/100</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Est. Learning Time
                </span>
                <span className="text-lg font-black text-blue-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {tech.estimatedLearningTime}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Roadmap Progress
                </span>
                <span className="text-lg font-black text-emerald-600">{roadmapProgress}%</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Practice Mode
                </span>
                <span className="text-lg font-black text-slate-800 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Ready
                </span>
              </div>
            </div>

            {/* TAB 1: INTERACTIVE WORKABLE ROADMAP */}
            {activeTab === 'roadmap' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      Workable Progression Pathway: {tech.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Step-by-step sequential milestones. Click circle to mark completed.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {completedStages.length} of {stages.length} Milestones Done
                  </span>
                </div>

                <div className="space-y-3 relative before:absolute before:top-4 before:bottom-4 before:left-5 before:w-0.5 before:bg-slate-200">
                  {stages.map((stg, idx) => {
                    const isDone = completedStages.includes(idx)
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isDone
                            ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-blue-300 shadow-xs'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => toggleStage(idx)}
                            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border transition-all mt-0.5 ${
                              isDone
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                                : 'border-slate-300 bg-white hover:border-blue-500 text-slate-300'
                            }`}
                            title="Toggle Milestone"
                          >
                            {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <Circle className="w-4 h-4" />}
                          </button>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4
                                className={`text-sm font-bold ${
                                  isDone ? 'line-through text-slate-500' : 'text-slate-900'
                                }`}
                              >
                                {stg.title}
                              </h4>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                {stg.duration}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{stg.goal}</p>

                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {stg.topics.map((top, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-medium"
                                >
                                  {top}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => handleStartPractice(stg.difficulty)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                          >
                            <Play className="w-3 h-3 text-blue-600" />
                            <span>Practice Quiz</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: OVERVIEW & RELEVANCE */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    Career Relevance & Industry Impact
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    {tech.careerRelevance}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      Prerequisites
                    </h3>
                    <ul className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                      {tech.prerequisites?.map((prereq) => (
                        <li key={prereq} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-cyan-600" />
                      Key Skills Required
                    </h3>
                    <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                      {tech.skillsRequired?.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-xl text-xs bg-white border border-slate-200 text-slate-700 font-medium shadow-2xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    Related Jobs & Career Roles
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tech.relatedJobs?.map((job) => (
                      <span
                        key={job}
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-700"
                      >
                        {job}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PORTFOLIO PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FolderGit2 className="w-4 h-4 text-emerald-600" />
                    Recommended Portfolio Projects
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">Build these capstones to prove mastery on your resume.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tech.projectSuggestions?.map((proj) => (
                    <div key={proj.title} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-xs">{proj.title}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                          {proj.complexity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{proj.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: INTERVIEW TOPICS */}
            {activeTab === 'interview' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MessageSquareQuote className="w-4 h-4 text-amber-600" />
                    Core Technical Interview Topics
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">High-frequency questions asked by Tier-1 companies.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  {tech.interviewTopics?.map((topic, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-800">
                      <span className="text-blue-600 font-black">•</span>
                      <span className="font-medium leading-relaxed">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              Close
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose()
                  navigate(`/app/learning-planner?tech=${encodeURIComponent(tech.name)}`)
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>Customize Plan</span>
              </button>

              {!isAlreadyInStack && (
                <button
                  onClick={handleAddToStack}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Add to Stack</span>
                </button>
              )}

              <button
                onClick={() => handleStartPractice()}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Start Practice Test</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
