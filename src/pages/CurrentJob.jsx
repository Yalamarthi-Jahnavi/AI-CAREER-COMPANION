import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase,
  Target,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
  Plus,
  Trash2,
  MessageSquare,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { useUserStore } from '../store/useUserStore'
import toast from 'react-hot-toast'

export function CurrentJob() {
  const { user } = useUserStore()

  const [responsibilities, setResponsibilities] = useState([
    { id: 'resp-1', title: 'Frontend Architecture & Performance SLA (< 1.5s LCP)', status: 'Mastered', progress: 95 },
    { id: 'resp-2', title: 'Microservices & API Gateway Integration', status: 'In Progress', progress: 80 },
    { id: 'resp-3', title: 'Sprint Delivery Velocity & Technical Debt Triage', status: 'On Track', progress: 85 },
    { id: 'resp-4', title: 'Junior Engineer Code Reviews & Mentorship', status: 'Mastered', progress: 90 },
  ])

  const [oneOnOneItems, setOneOnOneItems] = useState([
    { id: 'one-1', topic: 'Discuss Staff Engineer promotion criteria for upcoming Q4 review', priority: 'High', completed: false },
    { id: 'one-2', topic: 'Request budget approval for AWS Solutions Architect Certification', priority: 'Medium', completed: true },
    { id: 'one-3', topic: 'Propose refactoring WebSocket gateway to reduce reconnection spikes', priority: 'High', completed: false },
  ])

  const [newTopic, setNewTopic] = useState('')

  const handleAddTopic = (e) => {
    e.preventDefault()
    if (!newTopic.trim()) return
    setOneOnOneItems([
      ...oneOnOneItems,
      { id: `one-${Date.now()}`, topic: newTopic.trim(), priority: 'Medium', completed: false },
    ])
    setNewTopic('')
    toast.success('Added 1:1 meeting agenda item!')
  }

  const toggleTopic = (id) => {
    setOneOnOneItems(
      oneOnOneItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto text-slate-800 font-sans">
      {/* ── Top Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Briefcase className="w-7 h-7 text-indigo-500" />
              Current Job &amp; Role Tracker
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700">
              Role: {user?.role || 'Senior Software Engineer'}
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500">
            Track key responsibilities, 1:1 manager agendas, performance goals, and promotion readiness.
          </p>
        </div>
      </div>

      {/* ── Role & Impact Overview ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Role Mastery Index</span>
            <h3 className="text-sm font-bold text-slate-900">88% (Exceeding Expectations)</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Next Level Trajectory</span>
            <h3 className="text-sm font-bold text-slate-900">{user?.careerGoal || 'Staff Engineer'}</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-cyan-50 text-cyan-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Team Alignment Score</span>
            <h3 className="text-sm font-bold text-slate-900">92 / 100 (Strong)</h3>
          </div>
        </div>
      </div>

      {/* ── Responsibilities & 1:1 Prep Grid ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Responsibilities */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500" />
            Core Job Responsibilities &amp; SLA Health
          </h2>

          <div className="space-y-3">
            {responsibilities.map((r) => (
              <div key={r.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-800">{r.title}</h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {r.status}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                    style={{ width: `${r.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 1:1 Meeting Agenda Generator */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              1:1 Manager Meeting Agenda Builder
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Keep critical career conversations on track with prioritized discussion topics.
            </p>

            <form onSubmit={handleAddTopic} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Add topic for next 1:1..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>

            <div className="space-y-2.5">
              {oneOnOneItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleTopic(item.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    item.completed
                      ? 'bg-slate-50 border-slate-100 opacity-60'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        item.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-400 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                    </button>
                    <span className={`text-xs ${item.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {item.topic}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CurrentJob
