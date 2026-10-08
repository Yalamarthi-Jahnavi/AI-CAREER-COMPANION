import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Target,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Code2,
  BookOpen,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore'

export function SkillGapAnalyzer() {
  const { user } = useUserStore()
  const [targetRole, setTargetRole] = useState('Staff Engineer')

  const skillsData = [
    { skill: 'React & Frontend Architecture', current: 92, required: 90, status: 'Exceeds', gap: 0 },
    { skill: 'Distributed Systems & Caching', current: 78, required: 85, status: 'Gap (-7%)', gap: 7, color: '#f59e0b' },
    { skill: 'Cloud & Infrastructure (AWS/K8s)', current: 76, required: 80, status: 'Gap (-4%)', gap: 4, color: '#f59e0b' },
    { skill: 'Engineering Leadership & Mentorship', current: 90, required: 85, status: 'Exceeds', gap: 0 },
    { skill: 'System Design & High-Concurrency APIs', current: 82, required: 90, status: 'Gap (-8%)', gap: 8, color: '#ef4444' },
  ]

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto text-slate-800 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-amber-500" />
            AI Skill Gap Analyzer
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Compare your current verified skills against real-world Senior and Staff Job Descriptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Target Role:</span>
          <span className="px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
            {user?.careerGoal || targetRole}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500" />
            Skill Matrix &amp; Gap Heatmap
          </h2>

          <div className="space-y-4">
            {skillsData.map((item) => (
              <div key={item.skill} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{item.skill}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    item.gap === 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Your Level: <strong className="text-slate-900">{item.current}%</strong></span>
                  <span>Target Benchmark: <strong className="text-slate-700">{item.required}%</strong></span>
                </div>

                {/* Comparative bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${item.current}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Prioritized Upskilling Plan
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Closing these 2 key gaps in <strong>Distributed Systems</strong> and <strong>System Design</strong> will boost your interview readiness to 95%+.
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">1. Distributed Caching &amp; Sharding</div>
                <div className="text-slate-500 text-[11px]">Recommended: Module 4 in Tech Roadmap</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">2. High-Concurrency API Gateways</div>
                <div className="text-slate-500 text-[11px]">Recommended: DevCollab Phase 3 Blueprint</div>
              </div>
            </div>
          </div>

          <Link
            to="/app/learning-planner"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            Launch Personalized Learning Plan
          </Link>
        </div>
      </div>
    </div>
  )
}
export default SkillGapAnalyzer
